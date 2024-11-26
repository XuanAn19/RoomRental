using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RoomSocialBE.Authentication;
using RoomSocialBE.Models;

namespace RoomSocialBE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> userManager;

        public RoomsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
            this._context = context;

        }


        [HttpGet]
        [Route("get_data_post_room")]
        public async Task<IActionResult> GetDataPostRoom()
        {
            try
            {
                var categories = await _context.Categories
                    .Select(c => new { c.id, c.name })
                    .ToListAsync();

                var addresses = await _context.Addresses
                    .Select(a => new { a.id, a.province, a.district, a.ward })
                    .ToListAsync();

                var users = await _context.Users
                    .Select(u => new { u.Id, u.full_name, u.Email, u.PhoneNumber })
                    .ToListAsync();

                return Ok(new
                {
                    Categories = categories,
                    Addresses = addresses,
                    Users = users
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("post_room")]
        public async Task<IActionResult> PostRoom([FromBody] PostRoomModel model)
        {
            var user = await userManager.FindByIdAsync(model.id_user);
            if (user == null)
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "id_user isn't exist in system!"
                });

            var category = await _context.Categories.FirstOrDefaultAsync(u => u.id == model.id_category);
            if (category == null)
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "id_category isn't exist in system!"
                });

            Address address = new Address
            {
                number_house = model.address.number_house,
                street_name = model.address.street_name,
                ward = model.address.ward,
                district = model.address.district,
                province = model.address.province
            };

            await _context.Addresses.AddAsync(address);
            var result = await _context.SaveChangesAsync();
            if (result == 0)
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Creating address was error!"
                });

            var idAddress = await _context.Addresses
                .Where(u => u.number_house == model.address.number_house && u.street_name == model.address.street_name
                && u.ward == model.address.ward && u.district == model.address.district && u.province == model.address.province)
                .Select(u => u.id)
                .FirstOrDefaultAsync();

            Room room = new Room
            {
                id_user = model.id_user,
                id_adress = idAddress, 
                id_category = model.id_category,
                title = model.title,
                description = model.description,
                arge = model.arge,
                price = model.price,
                quantity_room = model.quanity_room,
                images = model.images,
                created_day = DateTime.Now,
                status = true,
            };

            await _context.Rooms.AddAsync(room);
            var resultPostRoom = await _context.SaveChangesAsync();

            if (resultPostRoom > 0)
            {
                return Ok(new Response
                {
                    Status = "Success",
                    Message = "Creating post of room success!"
                });
            }
            else
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Creating post of room was error!"
                });
            }
        }
    }
}
