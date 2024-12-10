using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomSocialBE.Authentication;
using RoomSocialBE.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace RoomSocialBE.Controllers
{
    public class StatusDto
    {
        public string id_user { get; set; }
        public string content { get; set; }
    }

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

        // Lấy tất cả trạng thái có trong hệ thống
        [HttpGet]
        public async Task<IActionResult> GetAllStatus() 
        {
            var result = await _context.Status.ToListAsync();
            return Ok(new Response
            {
                Status = "Success",
                Message = "Get all status in system",
                Data = result
            });
        }

        // lấy danh sách trạng thái của người dùng
        [HttpGet("User/{id_user}")]
        public async Task<IActionResult> GetStatusWithUser(string id_user)
        {
            var statuses = await _context.Status
                                 .Where(s => s.id_user == id_user)
                                 .ToListAsync();

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
                Data = statuses
            });
        }

        // Lấy chi tiết 1 trạng thái 
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

            return Ok(new Response
            {
                Status = "Success",
                Message = "Status retrieved successfully.",
                Data = status
            });
        }

        // Tạo 1 trạng thái của người dùng
        [HttpPost]
        public async Task<IActionResult> CreateStatusWithUser([FromBody] StatusDto model)
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
                creat_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                User = user
            };

            _context.Status.Add(newStatus);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Status created successfully.",
                Data = new
                {
                    id_status = newStatus.Id,
                    id_user = newStatus.id_user,
                    content = newStatus.content,
                    creat_at = newStatus.creat_at,
                    updated_at = newStatus.updated_at
                }
            });
        }

        // Xóa 1 trạng thái của người dùng
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

        // Chỉnh sửa nội dung 1 trạng thái của người dùng
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
            status.updated_at = DateTime.UtcNow;

            _context.Status.Update(status);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Status updated successfully.",
                Data = status
            });
        }

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
