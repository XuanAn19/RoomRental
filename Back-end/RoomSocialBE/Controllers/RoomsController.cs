﻿using Microsoft.AspNetCore.Authorization;
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
        public async Task<IActionResult> GetAllRooms()
        {
            var result = await _context.Rooms
        .Include(r => r.Address) 
        .Select(r => new
        {
            r.id,
            r.id_user,
            r.id_adress,
            Address = new
            {
                r.Address.number_house,
                r.Address.street_name,
                r.Address.ward,
                r.Address.district,
                r.Address.province
            },
            r.id_category,
            r.title,
            r.description,
            r.arge,
            r.price,
            r.quantity_room,
            r.images,
            r.created_day,
            r.status
        })
        .ToListAsync();
        return Ok(new Response
        {
            Status = "Success",
            Message = "Get All Rooms are succefully",
            Data = result
        });
        }

        [HttpGet]
        [Route("{idRoom}")]
        public async Task<IActionResult> GetRoomByIdRoom(int idRoom)
        {
            var result = await _context.Rooms
            .Include(r => r.Address)
            .Include(r => r.Category)
            .Select(r => new
            {
                r.id,
                r.id_user,
                r.id_adress,
                Address = new
                {
                    r.Address.number_house,
                    r.Address.street_name,
                    r.Address.ward,
                    r.Address.district,
                    r.Address.province
                },
                r.id_category,
                Category = new
                {
                    r.Category.name
                },
                r.title,
                r.description,
                r.arge,
                r.price,
                r.quantity_room,
                r.images,
                r.created_day,
                r.status
            })
            .FirstOrDefaultAsync(u => u.id == idRoom);

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get rooms by 'Id' succefully",
                Data = result
            });
        }

        // Lấy các phòng theo idUser
        [Authorize]
        [HttpGet]
        [Route("User/{idUser}")]
        public async Task<IActionResult> GetRoomsByIdUser(string idUser)
        {
            var result = await _context.Rooms
            .Include(r => r.Address)
            .Include(r => r.Category)
            .Where(u => u.id_user == idUser)
            .Select(r => new
            {
                r.id,
                r.id_user,
                r.id_adress,
                Address = new
                {
                    r.Address.number_house,
                    r.Address.street_name,
                    r.Address.ward,
                    r.Address.district,
                    r.Address.province
                },
                r.id_category,
                Category = new
                {
                    r.Category.name
                },
                r.title,
                r.description,
                r.arge,
                r.price,
                r.quantity_room,
                r.images,
                r.created_day,
                r.status
            })
            .ToListAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get rooms by 'IdUser' succefully",
                Data = result
            });
        }

        [Authorize]
        [HttpGet]
        [Route("User/{idUser}/Status/{status}")]
        public async Task<IActionResult> GetRoomsWithUserByStatus(string idUser, bool status)
        {
            var result = await _context.Rooms
            .Include(r => r.Address)
            .Include(r => r.Category)
            .Where(u => u.id_user == idUser && u.status == status)
            .Select(r => new
            {
                r.id,
                r.id_user,
                r.id_adress,
                Address = new
                {
                    r.Address.number_house,
                    r.Address.street_name,
                    r.Address.ward,
                    r.Address.district,
                    r.Address.province
                },
                r.id_category,
                Category = new
                {
                    r.Category.name
                },
                r.title,
                r.description,
                r.arge,
                r.price,
                r.quantity_room,
                r.images,
                r.created_day,
                r.status
            })
            .ToListAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get rooms by 'IdCategory' and 'IdUser' succefully",
                Data = result
            });
        }

        [Authorize]
        [HttpGet]
        [Route("User/{idUser}/Category/{idCategory}")]
        public async Task<IActionResult> GetRoomsWithUserByIdCategory(string idUser, int idCategory)
        {
            var result = await _context.Rooms
            .Include(r => r.Address)
            .Include(r => r.Category)
            .Where(u => u.id_user == idUser && u.id_category == idCategory)
            .Select(r => new
            {
                r.id,
                r.id_user,
                r.id_adress,
                Address = new
                {
                    r.Address.number_house,
                    r.Address.street_name,
                    r.Address.ward,
                    r.Address.district,
                    r.Address.province
                },
                r.id_category,
                Category = new
                {
                    r.Category.name
                },
                r.title,
                r.description,
                r.arge,
                r.price,
                r.quantity_room,
                r.images,
                r.created_day,
                r.status
            })
            .ToListAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get rooms by 'IdCategory' and 'IdUser' succefully",
                Data = result
            });
        }

        [Authorize]
        [HttpGet]
        [Route("User/{idUser}/Search/{keyName}")]
        public async Task<IActionResult> GetRoomsWithUserByKeyName(string idUser, string keyName)
        {
            var result = await _context.Rooms
            .Include(r => r.Address)
            .Include(r => r.Category)
            .Where(u => u.id_user == idUser && (u.title.Contains(keyName) || u.description.Contains(keyName)))
            .Select(r => new
            {
                r.id,
                r.id_user,
                r.id_adress,
                Address = new
                {
                    r.Address.number_house,
                    r.Address.street_name,
                    r.Address.ward,
                    r.Address.district,
                    r.Address.province
                },
                r.id_category,
                Category = new
                {
                    r.Category.name
                },
                r.title,
                r.description,
                r.arge,
                r.price,
                r.quantity_room,
                r.images,
                r.created_day,
                r.status
            })
            .ToListAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get rooms by 'IdUser' and 'KeyName' succefully",
                Data = result
            });
        }

        [Authorize]
        [HttpGet]
        [Route("User/{idUser}/Search/{keyName}/Category/{idCategory}")]
        public async Task<IActionResult> GetRoomsWithUserByCategoryAndKeyName(string idUser, string keyName, int idCategory)
        {
            var result = await _context.Rooms
            .Include(r => r.Address)
            .Include(r => r.Category)
            .Where(u => u.id_user == idUser && u.id_category == idCategory && (u.title.Contains(keyName) || u.description.Contains(keyName)))
            .Select(r => new
            {
                r.id,
                r.id_user,
                r.id_adress,
                Address = new
                {
                    r.Address.number_house,
                    r.Address.street_name,
                    r.Address.ward,
                    r.Address.district,
                    r.Address.province
                },
                r.id_category,
                Category = new
                {
                    r.Category.name
                },
                r.title,
                r.description,
                r.arge,
                r.price,
                r.quantity_room,
                r.images,
                r.created_day,
                r.status
            })
            .ToListAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get rooms by 'KeyName' and 'IdCategory' succefully",
                Data = result
            });
        }

        [HttpGet]
        [Route("Category/{idCategory}")]
        public async Task<IActionResult> GetRoomsByIdCategory(int idCategory)
        {
            var result = await _context.Rooms
            .Include(r => r.Address)
            .Include(r => r.Category)
            .Where(u => u.id_category == idCategory)
            .Select(r => new
            {
                r.id,
                r.id_user,
                r.id_adress,
                Address = new
                {
                    r.Address.number_house,
                    r.Address.street_name,
                    r.Address.ward,
                    r.Address.district,
                    r.Address.province
                },
                r.id_category,
                Category = new
                {
                    r.Category.name
                },
                r.title,
                r.description,
                r.arge,
                r.price,
                r.quantity_room,
                r.images,
                r.created_day,
                r.status
            })
            .ToListAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Get rooms by 'IdCategory' succefully",
                Data = result
            });
        }

        [Authorize(Roles = UserRoles.User)]
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

        [Authorize(Roles = UserRoles.User)]
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateInformationRoom(int id, [FromBody] PostRoomModel model)
        {
            bool isExistRoom = await _context.Rooms.AnyAsync(u => u.id == id && u.id_user == model.id_user);
            if (isExistRoom) {
                var roomAddress = await _context.Addresses.FirstOrDefaultAsync(u => u.id == model.address.id);
                roomAddress.number_house = model.address.number_house;
                roomAddress.street_name = model.address.street_name;
                roomAddress.ward = model.address.ward;
                roomAddress.district = model.address.district;
                roomAddress.province = model.address.province;
                _context.Addresses.Update(roomAddress);

                var room = await _context.Rooms.FirstOrDefaultAsync(u => u.id == id);
                room.id_category = model.id_category;
                room.title = model.title;
                room.description = model.description;
                room.arge = model.arge;
                room.price = model.price;
                room.quantity_room = model.quanity_room;
                room.images = model.images;
                _context.Rooms.Update(room);
                int a = 5;
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    return Ok(new Response
                    {
                        Status = "Success",
                        Message = "Room information updated successfully!"
                    });
                }
                else
                {
                    return BadRequest(new Response
                    {
                        Status = "Fail",
                        Message = "Failed to update room information!"
                    });
                }
            }
            else
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "id_room and id_user is not compatible!"
                });
            }
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "Not found with id that you provided!"
                });
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return Ok(new Response
            {
                Status = "Success",
                Message = "Delete room is successfully!"
            });
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpPut]
        [Route("switch_status_room/{id}")]
        public async Task<IActionResult> SwitchStatusRoom(int id)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.id == id);

            if (room == null)
            {
                return NotFound(new Response
                {
                    Status = "Fail",
                    Message = "Room with the given ID does not exist!"
                });
            }

            room.status = !room.status;
            _context.Rooms.Update(room);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return Ok(new Response
                {
                    Status = "Success",
                    Message = $"Room status updated successfully! New status: {(room.status ? "Visible" : "Hidden")}"
                });
            }
            else
            {
                return BadRequest(new Response
                {
                    Status = "Fail",
                    Message = "Failed to update room status!"
                });
            }
        }
    }
}
