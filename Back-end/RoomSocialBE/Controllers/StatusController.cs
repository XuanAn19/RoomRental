using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomSocialBE.Authentication;
using RoomSocialBE.DTOs;
using RoomSocialBE.Models;

namespace RoomSocialBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> userManager;

        public StatusController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
            this._context = context;
        }

        private IEnumerable<object> FormatStatusList(IEnumerable<Status> statuses)
        {
            return statuses.Select(s => new
            {
                s.Id,
                s.id_user,
                s.content,
                creat_at = s.creat_at.ToString("dd/MM/yyyy HH:mm:ss"),
                updated_at = s.updated_at.ToString("dd/MM/yyyy HH:mm:ss")
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStatus()
        {
            var result = await _context.Status.OrderByDescending(s => s.updated_at).ToListAsync();

            var formattedResult = FormatStatusList(result);

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get all status in system",
                Data = formattedResult
            });
        }

        [HttpGet("User/{id_user}")]
        public async Task<IActionResult> GetStatusWithUser(string id_user)
        {
            var statuses = await _context.Status
                                 .Where(s => s.id_user == id_user)
                                 .OrderByDescending(f => f.updated_at)
                                 .ToListAsync();

            var formattedResult = FormatStatusList(statuses);

            if (!statuses.Any())
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "No statuses found for the specified user."
                });
            }

            return Ok(new Response
            {
                Status = "Success",
                Message = "Statuses retrieved successfully.",
                Data = formattedResult
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatusById(int id)
        {
            var status = await _context.Status.FindAsync(id);

            if (status == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "Status not found."
                });
            }

            var formattedResult = FormatStatusList(new List<Status> { status }).FirstOrDefault();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Status retrieved successfully.",
                Data = formattedResult
            });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpPost]
        public async Task<IActionResult> CreateStatusWithUser([FromBody] StatusDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Invalid data provided."
                });
            }

            var user = await userManager.FindByIdAsync(model.id_user);
            if (user == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "User not found."
                });
            }

            var newStatus = new Status
            {
                id_user = model.id_user,
                content = model.content,
                creat_at = DateTime.Now,
                updated_at = DateTime.Now,
                User = user
            };

            _context.Status.Add(newStatus);
            await _context.SaveChangesAsync();

            var formattedResult = FormatStatusList(new List<Status> { newStatus }).FirstOrDefault();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Status created successfully.",
                Data = formattedResult
            });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatusWithUser(int id)
        {
            var status = await _context.Status.FindAsync(id);

            if (status == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "Status not found."
                });
            }

            _context.Status.Remove(status);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Status deleted successfully."
            });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatusWithUser(int id, [FromBody] string content)
        {
            var status = await _context.Status.FindAsync(id);

            if (status == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "Status not found."
                });
            }

            status.content = content;
            status.updated_at = DateTime.Now;

            _context.Status.Update(status);
            await _context.SaveChangesAsync();

            var formattedResult = FormatStatusList(new List<Status> { status }).FirstOrDefault();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Status updated successfully.",
                Data = formattedResult
            });
        }

        [Authorize]
        [HttpGet("User/{id_user}/quanity")]
        public async Task<IActionResult> GetQuanityStatusWithUser(string id_user)
        {
            if (string.IsNullOrEmpty(id_user))
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Field 'id_user' is required."
                });
            }

            var user = await userManager.FindByIdAsync(id_user);
            if (user == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "User not found."
                });
            }

            var statusCount = await _context.Status
            .CountAsync(s => s.id_user == id_user);

            return Ok(new Response
            {
                Status = "Success",
                Message = $"User {id_user} has {statusCount} statuses.",
                Data = statusCount
            });
        }
    }
}
