using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using RoomSocialBE.Authentication;
using System.Text;

namespace RoomSocialBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpGet("/api/admin/non-landlord-users")]
        public async Task<ActionResult<List<ApplicationUser>>> GetNonLandlordUsers()
        {

            var userRoleId = await _context.Roles.Where(role => role.Name == "User").Select(role => role.Id).FirstOrDefaultAsync();

            if (userRoleId == null) { return NotFound(new { status = "no", message = "Role 'User' not found." }); }

            // Lấy danh sách người dùng có vai trò "User" và is_true == false
            var usersWithRoleUser = await _context.Users.Where(user =>user.is_true == false ).ToListAsync();

            if (!usersWithRoleUser.Any())
            {
                return NotFound(new Response{ Status = "no", Message= "No users found with the 'User' role and is_true == false." });
            }

            return Ok(usersWithRoleUser);
        }

        [HttpPut("/api/admin/management-verify/confirm/{id}")]
        public async Task<IActionResult> Confirm(string id)
        {
            var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { status = "no", message = "User not found." });
            }

            if (await _userManager.IsInRoleAsync(user, "User")) { await _userManager.RemoveFromRoleAsync(user, "User"); }

            var roleResult = await _userManager.AddToRoleAsync(user, "Landlord");

            if (!roleResult.Succeeded)
            {
                return BadRequest(new { status = "no", message = "Failed to update role to Landlord." });
            }

            user.is_true = true;
            user.UpdatedateVerify = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Gửi email thông báo
            SendEmail( user.Email,  "Account Upgrade: Landlord Role Assigned", "Congratulations! Your account has been successfully upgraded to the role of <strong>Landlord</strong> on RoomRental. You can now manage your listings and enjoy additional features exclusive to landlords.");

            return Ok(new { status = "oke", message = "User role updated to Landlord successfully." });
        }

        public class CancelVerification
        {
            public string Why { get; set; } 
        }
        [HttpPut("/api/admin/management-verify/cancel/{id}")]
        public async Task<IActionResult> Cancel(string id, [FromBody] CancelVerification request)
        {
            var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { status = "no", message = "User not found." });
            }

            if (await _userManager.IsInRoleAsync(user, "Landlord"))
            {
                var removeRoleResult = await _userManager.RemoveFromRoleAsync(user, "Landlord");
                if (!removeRoleResult.Succeeded)
                {
                    return BadRequest(new { status = "no", message = "Failed to remove Landlord role." });
                }
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!addRoleResult.Succeeded)
            {
                return BadRequest(new { status = "no", message = "Failed to update role to User." });
            }

            user.is_true = null;
            user.UpdatedateVerify =DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Gửi email thông báo, kèm lý do hủy
            string emailBody = $"Your verification request has been canceled by the administrator.<br><br>" +
                               $"Reason: {request.Why ?? "No reason provided."}";
            SendEmail(user.Email, "Your verification has been canceled", emailBody);

            return Ok(new { status = "oke", message = "User verification canceled successfully." });
        }

        private void SendEmail(string email, string subject, string bodyContent)
        {
            var emailMessage = new StringBuilder();
            emailMessage.AppendLine("<html>");
            emailMessage.AppendLine("<body>");
            emailMessage.AppendLine($"<p>Dear {email},</p>");
            emailMessage.AppendLine($"<p>{bodyContent}</p>");
            emailMessage.AppendLine("<br>");
            emailMessage.AppendLine("<p>Best regards,</p>");
            emailMessage.AppendLine("<p><strong>RoomRental Team</strong></p>");
            emailMessage.AppendLine("</body>");
            emailMessage.AppendLine("</html>");

            string message = emailMessage.ToString();

            // In nội dung email ra console trước khi gửi
            Console.WriteLine("=== Email Content ===");
            Console.WriteLine(message);
            Console.WriteLine("=====================");

            var mailMessage = new MimeMessage();
            mailMessage.To.Add(MailboxAddress.Parse(email));
            mailMessage.From.Add(MailboxAddress.Parse("chienxm8315@gmail.com"));
            mailMessage.Subject = subject;
            mailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = message };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            smtp.Authenticate("chienxm8315@gmail.com", "iapx tuub fwbf kcla"); // Mật khẩu ứng dụng
            smtp.Send(mailMessage);
            smtp.Disconnect(true);
        }
    }
}
