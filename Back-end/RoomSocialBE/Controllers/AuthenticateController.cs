
﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using RoomSocialBE.Authentication;
using System.IdentityModel.Tokens.Jwt;
﻿using Microsoft.AspNetCore.Http;
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

            user.is_verification_code_valid = null;
            await userManager.UpdateAsync(user);

            var (token, expiration) = await GenerateTokenAsync(user, userRoles);

            return Ok(new
            {
                Status = "Success",
                token = token,
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
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            var valid = token.ValidTo;
            return (new JwtSecurityTokenHandler().WriteToken(token), valid);
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

        [HttpPost("reset_password/{email}")]
        public async Task<IActionResult> ResetPassword(string email, [FromBody] string newPassword)
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

		[HttpPost("change_password")]
		[Authorize]
		public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
		{
			if (!ModelState.IsValid)
				return BadRequest(new Response { Status = "Fail", Message = "Invalid input data." });


			var identityToken = HttpContext.User.Identity as ClaimsIdentity;
			var emailClaim = identityToken?.FindFirst(ClaimTypes.Email)?.Value;

			if (string.IsNullOrEmpty(emailClaim))
				return Unauthorized(new Response { Status = "Fail", Message = "User email not found in token." });

			var user = await userManager.FindByEmailAsync(emailClaim);
			if (user == null)
				return Unauthorized(new Response { Status = "Fail", Message = "User not found." });

			var isCurrentPasswordValid = await userManager.CheckPasswordAsync(user, model.CurrentPassword);
			if (!isCurrentPasswordValid)
				return BadRequest(new Response { Status = "Fail", Message = "Current password is incorrect." });


			var result = await userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
			if (!result.Succeeded)
			{
				var errors = string.Join(", ", result.Errors.Select(e => e.Description));
				return BadRequest(new Response { Status = "Fail", Message = $"Password change failed: {errors}" });
			}   

			return Ok(new Response { Status = "Success", Message = "Password has been changed successfully!" });
		}




		[HttpPost("update_profile")]
		[Authorize]
		public async Task<IActionResult> UpdateProfile([FromForm] ProfileUpdateModel model)
		{

			if (!ModelState.IsValid)
			{
				return BadRequest(new Response { Status = "Fail", Message = "Dữ liệu không hợp lệ." });
			}

			var identityToken = HttpContext.User.Identity as ClaimsIdentity;
			var emailClaim = identityToken?.FindFirst(ClaimTypes.Email)?.Value;

			if (string.IsNullOrEmpty(emailClaim))
			{
				return Unauthorized(new Response { Status = "Fail", Message = "User email not found in token" });
			}

			var user = await userManager.FindByEmailAsync(emailClaim);
			if (user == null)
			{
				return Unauthorized(new Response { Status = "Fail", Message = "User not found." });
			}

			user.full_name = model.FullName;
			user.PhoneNumber = model.PhoneNumber;
			

			if (model.ProfileImage != null)
			{
				var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ProfileImage.FileName);
				var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

				using (var stream = new FileStream(filePath, FileMode.Create))
				{
					await model.ProfileImage.CopyToAsync(stream);
				}

				user.image = fileName;  
			}

			var updateResult = await userManager.UpdateAsync(user);

			if (updateResult.Succeeded)
			{
				return Ok(new Response { Status = "Success", Message = "Update profile successfully!" });
			}
			else
			{
				var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
				return BadRequest(new Response { Status = "Fail", Message = $"Update profile fail: {errors}" });
			}
		}

		[HttpPost("register_verify")]
		[Authorize]
		public async Task<IActionResult> RegisterLandlord([FromForm] VerifyRegistration model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(new Response { Status = "Fail", Message = "Invalid data provided." });
			}

			var identityToken = HttpContext.User.Identity as ClaimsIdentity;
			var emailClaim = identityToken?.FindFirst(ClaimTypes.Email)?.Value;

			if (string.IsNullOrEmpty(emailClaim))
			{
				return Unauthorized(new Response { Status = "Fail", Message = "User email not found in token." });
			}

			var user = await userManager.FindByEmailAsync(emailClaim);
			if (user == null)
			{
				return Unauthorized(new Response { Status = "Fail", Message = "User not found." });
			}
            if(user.is_true != null)
            {
                return Unauthorized(new Response { Status = "Fail", Message = "User registered verify." });
            }

			user.PhoneNumber = model.PhoneNumber;
			if (model.FullName != null)
			{
				user.full_name = model.FullName;
			}
			if (model.PhoneNumber != null)
			{
				user.PhoneNumber = model.PhoneNumber;
			}

			if (model.ProfileImage != null)
			{
				var profileFileName = Guid.NewGuid().ToString() + Path.GetExtension(model.ProfileImage.FileName);
				var profileFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", profileFileName);

				using (var stream = new FileStream(profileFilePath, FileMode.Create))
				{
					await model.ProfileImage.CopyToAsync(stream);
				}
				user.image = profileFileName;
			}

            if (model.CccdImages != null)
            {
                var folderName = !string.IsNullOrEmpty(user.Id) ? user.Id : user.Email;
                var sanitizedFolderName = string.Concat(folderName.Split(Path.GetInvalidFileNameChars()));

                var userFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "verify", sanitizedFolderName);

                if (!Directory.Exists(userFolderPath))
                {
                    Directory.CreateDirectory(userFolderPath);
                }

                var cccdImagePaths = new List<string>();

                foreach (var cccdImage in model.CccdImages)
                {
                    var cccdFileName = Guid.NewGuid().ToString() + Path.GetExtension(cccdImage.FileName);
                    var cccdFilePath = Path.Combine(userFolderPath, cccdFileName);

                    using (var stream = new FileStream(cccdFilePath, FileMode.Create))
                    {
                        await cccdImage.CopyToAsync(stream);
                    }

                    cccdImagePaths.Add(Path.Combine("verify", sanitizedFolderName, cccdFileName));
                }


                user.images_CCCD = string.Join(",", cccdImagePaths);

            }
			user.is_true = false;

			var updateResult = await userManager.UpdateAsync(user);
			if (updateResult.Succeeded)
			{
				return Ok(new Response { Status = "Success", Message = "Registration submitted successfully! Awaiting admin confirmation." });
			}
			else
			{
				var errors = string.Join(", ", updateResult.Errors.Select(e => e.Description));
				return BadRequest(new Response { Status = "Fail", Message = $"Registration failed: {errors}" });
			}
		}

		[HttpGet("get_my_information")]
		[Authorize]
		public async Task<IActionResult> GetMyInformation()
		{
			// Lấy email từ token
			var identityToken = HttpContext.User.Identity as ClaimsIdentity;
			var emailClaim = identityToken?.FindFirst(ClaimTypes.Email)?.Value;

			if (string.IsNullOrEmpty(emailClaim))
			{
				return Unauthorized(new Response { Status = "Fail", Message = "User email not found in token." });
			}

	
			var user = await userManager.FindByEmailAsync(emailClaim);
			if (user == null)
			{
				return NotFound(new Response { Status = "Fail", Message = "User not found." });
			}


			var userInfo = new
			{
				FullName = user.full_name,
				Email = user.Email,
				PhoneNumber = user.PhoneNumber,
				Image = user.image != null ? $"{Request.Scheme}://{Request.Host}/images/{user.image}" : null,
				CccdImages = user.images_CCCD?.Split(',').Select(img =>$"{Request.Scheme}://{Request.Host}/{img.Replace("\\", "/")}").ToList(),
				IsVerified = user.is_true
			};

			return Ok(new Response { Status = "Success" , Message = "User information retrieved successfully.", Data = userInfo });
		}


		private int GetCodeRandom() => new Random().Next(100000, 999999);

        private async Task<ApplicationUser?> GetUser(string email) => await userManager.FindByEmailAsync(email);

    }
}
				return BadRequest(new Response { Status = "Fail", Message = $"Update fail: {errors}" });
			}
		}



		private int GetCodeRandom() => new Random().Next(100000, 999999);

        private async Task<ApplicationUser?> GetUser(string email) => await userManager.FindByEmailAsync(email);

    }
}
