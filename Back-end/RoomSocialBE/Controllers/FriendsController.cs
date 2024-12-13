using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class FriendsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> userManager;

        public FriendsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
            this._context = context;
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpPost]
        public async Task<IActionResult> CreateFriendRequest([FromBody] FriendRequestDTO request)
        {
            if (string.IsNullOrEmpty(request.id_user_send) || string.IsNullOrEmpty(request.id_user_accept))
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "id_user_send and id_user_accept are required."
                });
            }

            if (request.id_user_send == request.id_user_accept)
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "id_user_send and id_user_accept overlap."
                });
            }

            var sender = await userManager.FindByIdAsync(request.id_user_send);
            if (sender == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = $"Sender with ID {request.id_user_send} not found in system."
                });
            }

            var receiver = await userManager.FindByIdAsync(request.id_user_accept);
            if (receiver == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = $"Sender with ID {request.id_user_accept} not found in system."
                });
            }

            var existingRequest = await _context.Friends
                .FirstOrDefaultAsync(f => f.id_user_send == request.id_user_send && f.id_user_accept == request.id_user_accept);
            if (existingRequest != null)
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Friend request already exists."
                });
            }

            var newFriendRequest = new Friend
            {
                id_user_send = request.id_user_send,
                id_user_accept = request.id_user_accept,
                is_friend = false,
                creat_at = DateTime.Now,
                updated_at = DateTime.Now,
                UserSend = sender,
                UserAccept = receiver
            };

            _context.Friends.Add(newFriendRequest);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Friend request created successfully."
            });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpPut("{id}")]
        public async Task<IActionResult> AcceptFriendRequest(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Invalid Friend Request ID."
                });
            }

            var friendRequest = await _context.Friends.FindAsync(id);
            if (friendRequest == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = $"Friend request with ID {id} not found."
                });
            }

            if (friendRequest.is_friend)
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Friend request is already accepted."
                });
            }

            friendRequest.is_friend = true;
            friendRequest.updated_at = DateTime.Now;

            _context.Friends.Update(friendRequest);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Friend request accepted successfully."
            });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFriendRequest(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Invalid Friend Request ID."
                });
            }

            var friendRequest = await _context.Friends.FindAsync(id);
            if (friendRequest == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = $"Friend request with ID {id} not found."
                });
            }

            _context.Friends.Remove(friendRequest);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Friend request deleted successfully."
            });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpGet("list/{id_user}")]
        public async Task<IActionResult> ShowFriendsList(string id_user)
        {
            var user = await userManager.FindByIdAsync(id_user);
            if (user == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = $"User with ID {id_user} not found."
                });
            }

            var friends = await _context.Friends
            .Where(f => (f.id_user_send == id_user || f.id_user_accept == id_user) && f.is_friend)
            .OrderByDescending(f => f.updated_at)
            .Select(f => new
            {
                id_user = id_user,
                id_friend = f.id_user_send == id_user ? f.id_user_accept : f.id_user_send,
                is_friend = f.is_friend,
                created_at = f.creat_at.ToString("dd/MM/yyyy HH:mm:ss"),
                update_at = f.updated_at.ToString("dd/MM/yyyy HH:mm:ss"),
                friend_information = new
                {
                    full_name = f.id_user_send == id_user ? f.UserAccept.full_name : f.UserSend.full_name,
                    image = f.id_user_send == id_user
                    ? (f.UserAccept.image != null
                        ? $"{Request.Scheme}://{Request.Host}/images/{f.UserAccept.image}"
                        : null)
                    : (f.UserSend.image != null
                        ? $"{Request.Scheme}://{Request.Host}/images/{f.UserSend.image}"
                        : null)
                },
            })
            .ToListAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get friend list success}",
                Data = friends
            });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpGet("request_list/{id_user}")]
        public async Task<IActionResult> ShowFriendRequestList(string id_user)
        {
            var user = await userManager.FindByIdAsync(id_user);
            if (user == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = $"User with ID {id_user} not found."
                });
            }

            var friendRequests = await _context.Friends
            .Where(f => f.id_user_accept == id_user && !f.is_friend)
            .OrderByDescending(f => f.updated_at)
            .Select(f => new
            {
                id_friend_request = f.Id,
                id_user = id_user,
                id_user_send = f.id_user_send,
                is_friend = f.is_friend,
                created_at = f.creat_at.ToString("dd/MM/yyyy HH:mm:ss"),
                update_at = f.updated_at.ToString("dd/MM/yyyy HH:mm:ss"),
                sender_information = new
                {
                    full_name = f.UserSend.full_name,
                    image = f.UserSend.image != null ? $"{Request.Scheme}://{Request.Host}/images/{f.UserSend.image}" : null,
                },
            })
            .ToListAsync();

            return Ok(friendRequests);
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpGet("User/{id_user}/quanity")]
        public async Task<IActionResult> GetQuanityFriendWithUser(string id_user)
        {
            if (string.IsNullOrEmpty(id_user))
            {
                return BadRequest(new Response
                {
                    Status = "Error",
                    Message = "Field 'id_user' is required."
                });
            }

            var user = await userManager.FindByIdAsync(id_user);
            if (user == null)
            {
                return NotFound(new Response
                {
                    Status = "Error",
                    Message = "User not found."
                });
            }

            var friendCount = await _context.Friends
            .CountAsync(f => (f.id_user_send == id_user || f.id_user_accept == id_user) && f.is_friend);

            return Ok(new Response
            {
                Status = "Success",
                Message = $"User {id_user} has {friendCount} friends.",
                Data = friendCount
            });
        }
    }
}
