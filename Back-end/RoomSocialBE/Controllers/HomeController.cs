using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using RoomSocialBE.Authentication;
using RoomSocialBE.DTOs;
using RoomSocialBE.Models;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace RoomSocialBE.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class HomeController : ControllerBase
	{
		private readonly ApplicationDbContext _dataContext;
		private readonly IMapper _mapper;

		public HomeController(ApplicationDbContext dataContext, IMapper mapper)
		{
			_dataContext = dataContext;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<IActionResult> Search([FromQuery] SearchDTO search)
		{
			/*var data = await _dataContext.Rooms
				.Include(r => r.User)
				.Include(r => r.Address)
				.Include(r => r.Category)
				.ToListAsync();*/
			var data = _dataContext.Rooms.AsQueryable();

			if (data == null || !data.Any())
			{
				return NotFound("No data found");
			}


			if (!string.IsNullOrEmpty(search.SearchName))
			{
				data = data.Where(c => c.title.Contains(search.SearchName) || c.description.Contains(search.SearchName));
			}

			if (search.From.HasValue)
			{
				data = data.Where(p => p.price >= search.From.Value);
			}

			if (search.To.HasValue)
			{
				data = data.Where(p => p.price <= search.To.Value);
			}

			if (search.ArceFrom.HasValue)
			{
				data = data.Where(p => p.arge >= search.ArceFrom.Value);
			}

			if (search.ArceTo.HasValue)
			{
				data = data.Where(p => p.arge <= search.ArceTo.Value);
			}

			if (!string.IsNullOrEmpty(search.Address))
			{
				data = data.Where(a =>
						a.Address.province.Contains(search.Address) ||
						a.Address.district.Contains(search.Address) ||
						a.Address.ward.Contains(search.Address) ||
						a.Address.street_name.Contains(search.Address)
					);
			}
			/*
						if (data.Count < 5)
						{

							var additionalData = new List<Room>();

							if (!string.IsNullOrEmpty(search.SearchName))
							{
								additionalData = _dataContext.Rooms
									.Where(c => c.title.Contains(search.SearchName) || c.description.Contains(search.SearchName))
									.Include(r => r.User)
									.Include(r => r.Address)
									.Include(r => r.Category)
									.ToList();
							}

							if (search.To.HasValue)
							{
								additionalData.AddRange(_dataContext.Rooms
									.Where(p => p.price <= (search.To.Value * 2))
									.Include(r => r.User)
									.Include(r => r.Address)
									.Include(r => r.Category)
									.ToList());
							}

							if (search.ArceTo.HasValue)
							{
								additionalData.AddRange(_dataContext.Rooms
									.Where(p => p.arge <= (search.ArceTo.Value * 1.5))
									.Include(r => r.User)
									.Include(r => r.Address)
									.Include(r => r.Category)
									.ToList());
							}


							var resultSet = data.Concat(additionalData).Distinct().ToList();

							// Đảm bảo số lượng kết quả đủ 5
							if (resultSet.Count < 5)
							{
								resultSet.AddRange(additionalData.Take(5 - resultSet.Count));
							}

							data = resultSet.ToList();
						}
			*/

			switch (search.SortBy.ToLower())
			{
				case "price":
					data = search.SortDescending ? data.OrderByDescending(c => c.price) : data.OrderBy(c => c.price);
					break;
				case "arge":
					data = search.SortDescending ? data.OrderByDescending(c => c.arge) : data.OrderBy(c => c.arge);
					break;
				default:
					data = search.SortDescending ? data.OrderByDescending(c => c.created_day) : data.OrderBy(c => c.created_day);
					break;
			}


			//var roomDTOs = _mapper.Map<List<RoomDTO>>(data);
			// Chọn các RoomDTO từ các dữ liệu trong bảng Rooms
			var rooms = await data
			.Include(r => r.User)  // Liên kết với User
			.Include(r => r.Address)  // Liên kết với Address
			.Include(r => r.Category)  // Liên kết với Category
			.Select(r => new RoomDTO
			{
				id = r.id,
				id_user = r.id_user,
				id_address = r.id_adress,
				id_category = r.id_category,
				title = r.title,
				description = r.description,
				arge = r.arge,
				price = r.price,
				quantity_room = r.quantity_room,
				images = r.images,
				create_day = r.created_day,
				status = r.status,
				user = new ApplicationUser
				{
					Id = r.User.Id,
					UserName = r.User.UserName,
					Email = r.User.Email
				},
				address = new Address
				{
					id = r.Address.id,

				},
				category = new Category
				{
					id = r.Category.id,
					name = r.Category.name
				}
			})
			.ToListAsync();

			return Ok(rooms);
		}

		[HttpGet("find-roommates")]
		public async Task<ActionResult<List<RoomDTO>>> GetRoommatePosts()
		{
            var categoryName = "Tìm bạn ở ghép";
			var category = await _dataContext.Categories.FirstOrDefaultAsync(c => c.name == categoryName);
            if (category == null)
            {
                return NotFound("Category " + categoryName +" not found.");
            }
            var rooms = await _dataContext.Rooms
				.Include(r => r.User)  
				.Include(r => r.Address) 
				.Include(r => r.Category)  
				.Where(r => r.id_category == category.id && r.status == true) 
				.OrderByDescending(r => r.created_day)
                .Select(r => new RoomDTO
                {
                    id = r.id,
                    id_user = r.id_user,
                    id_address = r.id_adress,
                    id_category = r.id_category,
                    title = r.title,
                    description = r.description,
                    arge = r.arge,
                    price = r.price,
                    quantity_room = r.quantity_room,
                    images = r.images,
                    create_day = r.created_day,
                    status = r.status,
                    user = new ApplicationUser
                    {
                        Id = r.User.Id,
                        UserName = r.User.UserName,
                        Email = r.User.Email
                    },
                    address = new Address
                    {
                        id = r.Address.id,

                    },
                    category = new Category
                    {
                        id = r.Category.id,
                        name = r.Category.name
                    }
                })
                .ToListAsync();

            if (rooms == null || rooms.Count == 0 || !rooms.Any()) return BadRequest("Rooms not found");
            
            return Ok(rooms);
        }
    }
}
