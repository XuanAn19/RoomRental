using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using RoomSocialBE.Authentication;
using RoomSocialBE.Models;
using System.Security.Claims;
using static RoomSocialBE.Controllers.BookMarkController;

namespace RoomSocialBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookMarkController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookMarkController(ApplicationDbContext context)
        {
            _context = context;
        }
        public class GetIDRooom()
        {
            public int id_Room { get; set; }
        }
        private string GetUserIdFromToken()
        {
            var identityToken = HttpContext.User.Identity as ClaimsIdentity;

            return identityToken?.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        }
        [HttpPost]
        public async Task<IActionResult> AddOrRemoveBookmark([FromBody] GetIDRooom getID)
        {
            // Lấy userId từ token
            var userId = GetUserIdFromToken();
            if (userId == null)
            {
                return Unauthorized(new { status = "no", message = "Unauthorized" });
            }

            var room = _context.Rooms.FirstOrDefaultAsync(r => r.id == getID.id_Room);
            if (room == null)
            {

            }

            var bookmark = await _context.bookMarks
                .Include(u => u.Users)
                .Include(r => r.Rooms)
                .FirstOrDefaultAsync(b => b.id_user == userId && b.id_room == getID.id_Room);

            if (bookmark != null)
            {

                _context.bookMarks.Remove(bookmark);
                await _context.SaveChangesAsync();
                return Ok(new { status = "ok", message = "Bookmark removed successfully" });
            }
            else
            {

                var content = await _context.Rooms.FindAsync(getID.id_Room);
                var user = await _context.Users.FindAsync(userId);

                if (content != null && user != null)
                {
                    var newBookmark = new BookMark
                    {
                        id_user = userId,
                        id_room = content.id,
                        Users = user,
                        Rooms = content
                    };


                    _context.bookMarks.Add(newBookmark);
                    await _context.SaveChangesAsync();
                    return Ok(new { status = "ok", message = "Bookmark added successfully" });
                }
                else
                {
                    return NotFound(new { status = "no", message = "Room not found" });
                }
            }
        }
        [HttpGet]
        public async Task<ActionResult<List<BookMark>>> GetBookMarkByIdUser()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
            {
                return Unauthorized(new { status = "no", message = "Unauthorized" });
            }
            var bookmark = await _context.bookMarks.Where(b => b.id_user == userId).ToListAsync();
            if (bookmark == null || !bookmark.Any())
            {
                return NotFound(new { status = "no", message = "BookMark of User not Found" });
            }

            var bookmarkList = new List<BookMark>();

            foreach (var book in bookmark)
            {
                var room = await _context.Rooms
                    .Include(u => u.User)
                    .Include(c => c.Category)
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(r => r.id == book.id_room);

                if (room != null)
                {
                    var rooms = new Room
                    {
                        id = room.id,
                        id_user = userId,
                        id_adress = room.id_adress,
                        id_category = room.id_category,
                        title = room.title,
                        description = room.description,
                        arge = room.arge,
                        price = room.price,
                        quantity_room = room.quantity_room,
                        images = room.images,
                        status = room.status,
                        Address = room.Address != null ? new Address
                        {
                            province = room.Address.province,
                            district = room.Address.district,
                            ward = room.Address.ward,
                            street_name = room.Address.street_name,
                            number_house = room.Address.number_house
                        } : null,
                        Category = room.Category != null ? new Category
                        {
                            id = room.Category.id,
                            name = room.Category.name,
                        } : null,
                        User = room.User != null ? new ApplicationUser
                        {
                            full_name = room.User.full_name,
                            PhoneNumber = room.User.PhoneNumber,
                        } : null
                    };

                    bookmarkList.Add(new BookMark
                    {
                        id_user = book.id_user,
                        id_room = book.id_room,
                        Rooms = rooms
                    });
                }
            }

            return bookmarkList;
        }
    }
}
