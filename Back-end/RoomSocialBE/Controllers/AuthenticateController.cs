using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using RoomSocialBE.Authentication;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using MailKit.Net.Smtp;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;

namespace RoomSocialBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;

        public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                return BadRequest(new Response { Status = "Fail", Message = "Your email and password must not be null!" });

            var user = await GetUser(model.Email);
            if (user == null) return BadRequest(new Response { Status = "Fail", Message = "This email don't have in system!" });

            bool isPasswordValid = await userManager.CheckPasswordAsync(user, model.Password);
            if (!isPasswordValid) return BadRequest(new Response { Status = "Fail", Message = "The password is incorrect!" });

            bool isEmailConfirmed = await userManager.IsEmailConfirmedAsync(user);
            if (!isEmailConfirmed)
                return BadRequest(new Response { Status = "Fail", Message = "You need to confirm email before logging in!" });

            var userRoles = await userManager.GetRolesAsync(user);
            string refreshToken = GenerateRefreshToken();

            user.refresh_token = refreshToken;
            user.is_verification_code_valid = null;
            await userManager.UpdateAsync(user);

            var (accessToken, expiration) = await GenerateTokenAsync(user, userRoles);
            return Ok(new
            {
                Status = "Success",
                accessToken = accessToken,
                refreshToken = refreshToken,
                expiration = expiration,
                roles = userRoles
            });
        }

        private async Task<(string Token, DateTime Expiration)> GenerateTokenAsync(ApplicationUser? user, IList<string> userRoles)
        {
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddSeconds(20),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            var valid = token.ValidTo;
            return (new JwtSecurityTokenHandler().WriteToken(token), valid);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);

                return Convert.ToBase64String(randomNumber);
            }
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await GetUser(model.Email);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Fail", Message = "User already exists!" });

            int confirmationCode = GetCodeRandom();
            ApplicationUser user = new ApplicationUser()
            {
                UserName = model.Email,
                PasswordHash = model.Password,
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                full_name = model.FullName,
                PhoneNumber = model.PhoneNumber,
                email_code = confirmationCode,
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Fail", 
                    Message = "User creation failed! Please check user details and try again." });

            await userManager.AddToRoleAsync(user, "User");

            var _user = await GetUser(model.Email);
            SendEmail(_user!.Email!, confirmationCode.ToString());

            return Ok(new Response { Status = "Success", Message = "Thank you for your registration, kindly check your email for confirmation code" });
        }

        private void SendEmail(string email, string emailCode)
        {
            StringBuilder emailMessage = new StringBuilder();
            emailMessage.AppendLine("<html>");
            emailMessage.AppendLine("<body>");
            emailMessage.AppendLine($"<p>Dear {email}, </p>");
            emailMessage.AppendLine("<p>Thank you for using our system. Below is the verification code you need to get:</p>");
            emailMessage.AppendLine($"<h2>Verification Code: {emailCode}</h2>");
            emailMessage.AppendLine("<p>Please enter this code on our website.</p>");
            emailMessage.AppendLine("<p>If you did not request this, please ignore this email.</p>");
            emailMessage.AppendLine("<br>");
            emailMessage.AppendLine("<p>Best regards,</p>");
            emailMessage.AppendLine("<p><strong>RoomRental</strong></p>");
            emailMessage.AppendLine("</body>");
            emailMessage.AppendLine("</html>");

            string message = emailMessage.ToString();
            var _email = new MimeMessage();
            _email.To.Add(MailboxAddress.Parse(email));
            _email.From.Add(MailboxAddress.Parse("chienxm8315@gmail.com"));
            _email.Subject = "RoomRental";
            _email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = message };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            smtp.Authenticate("chienxm8315@gmail.com", "iapx tuub fwbf kcla");
            smtp.Send(_email);
            smtp.Disconnect(true);
        }

        [HttpPost("verify_code/{email}/{code:int}")]
        public async Task<IActionResult> VerifyCode(string email, int code)
        {
            if (string.IsNullOrEmpty(email) || code <= 0)
                return BadRequest(new Response { Status = "Fail", Message = "Invalid code provided" });

            var user = await GetUser(email);
            if (user == null) return BadRequest(new Response { Status = "Fail", Message = "This email isn't exist!" });

            if (user.email_code == code)
            {
                user.EmailConfirmed = true;
                user.is_verification_code_valid = true;
                user.email_code = null;
                var updateResult = await userManager.UpdateAsync(user);
                if (updateResult.Succeeded)
                    return Ok(new Response { Status = "Success", Message = "Email confirmed successfully!" });
                else
                    return BadRequest(new Response { Status = "Fail", Message = "Error confirming email." });
            }
            return BadRequest(new Response { Status = "Fail", Message = "This code is incorrect!" });
        }

        [HttpPost("forgot_password/{email}")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await GetUser(email);
            if (user == null) return BadRequest(new Response
            {
                Status = "Fail",
                Message = "This email isn't exist in system!"
            });

            int emailCode = GetCodeRandom();
            SendEmail(email, emailCode.ToString());

            user.email_code = emailCode;
            user.is_verification_code_valid = false;
            await userManager.UpdateAsync(user);
            
            return Ok(new Response { Status = "Success", Message = "Please check your email for the confirmation code!" });
        }

        [HttpPost("reset_password/{email}/{newPassword}")]
        public async Task<IActionResult> ResetPassword(string email, string newPassword)
        {
            var user = await GetUser(email);

            if (user == null)
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "This email isn't exist in system!"
                });
            }

            if (user.is_verification_code_valid == false || user.is_verification_code_valid == null)  
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Please confirm your email first before resetting the password!"
                });
            }

            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
            var resetPasswordResult = await userManager.ResetPasswordAsync(user, resetToken, newPassword);

            if (!resetPasswordResult.Succeeded)
            {
                var errors = string.Join(", ", resetPasswordResult.Errors.Select(e => e.Description));
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = $"Failed to reset password: {errors}"
                });
            }

            return Ok(new Response { Status = "Success", Message = "Password has been reset successfully!" });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new Response { Status = "Fail", Message = "User is not authenticated" });

            var user = await GetUser(email);
            if (user == null)
                return Unauthorized(new Response { Status = "Fail", Message = "User not found" });

            user.refresh_token = null; 
            await userManager.UpdateAsync(user);

            return Ok(new Response { Status = "Success", Message = "Logged out successfully" });
        }

        private int GetCodeRandom() => new Random().Next(100000, 999999);

        private async Task<ApplicationUser?> GetUser(string email) => await userManager.FindByEmailAsync(email);

    }
}
