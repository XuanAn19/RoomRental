using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomSocialBE.Authentication;
using RoomSocialBE.DTOs;
using RoomSocialBE.Model;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
			var data = await _dataContext.room
				.Include(r => r.user)
				.Include(r => r.address)
				.Include(r => r.category)
				.ToListAsync();

			if (data == null || !data.Any())
			{
				return NotFound("No data found");
			}

		
			if (!string.IsNullOrEmpty(search.SearchName))
			{
				data = data.Where(c => c.title.Contains(search.SearchName) || c.description.Contains(search.SearchName)).ToList();
			}

			if (search.From.HasValue)
			{
				data = data.Where(p => p.price >= search.From.Value).ToList();
			}

			if (search.To.HasValue)
			{
				data = data.Where(p => p.price <= search.To.Value).ToList();
			}

			if (search.ArceFrom.HasValue)
			{
				data = data.Where(p => p.arge >= search.ArceFrom.Value).ToList();
			}

			if (search.ArceTo.HasValue)
			{
				data = data.Where(p => p.arge <= search.ArceTo.Value).ToList();
			}

			if (!string.IsNullOrEmpty(search.Address))
			{
				data = data.Where(a =>
						a.address.province.Contains(search.Address) ||
						a.address.district.Contains(search.Address) ||
						a.address.ward.Contains(search.Address) ||
						a.address.street_name.Contains(search.Address)
					).ToList();
			}

			if (data.Count < 5)
			{
			
				var additionalData = new List<Room>();

				if (!string.IsNullOrEmpty(search.SearchName))
				{
					additionalData = _dataContext.room
						.Where(c => c.title.Contains(search.SearchName) || c.description.Contains(search.SearchName))
						.Include(r => r.user)
						.Include(r => r.address)
						.Include(r => r.category)
						.ToList();
				}

				if (search.To.HasValue)
				{
					additionalData.AddRange(_dataContext.room
						.Where(p => p.price <= (search.To.Value * 2))
						.Include(r => r.user)
						.Include(r => r.address)
						.Include(r => r.category)
						.ToList());
				}

				if (search.ArceTo.HasValue)
				{
					additionalData.AddRange(_dataContext.room
						.Where(p => p.arge <= (search.ArceTo.Value * 1.5))
						.Include(r => r.user)
						.Include(r => r.address)
						.Include(r => r.category)
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

			
			switch (search.SortBy.ToLower())
			{
				case "price":
					data = search.SortDescending ? data.OrderByDescending(c => c.price).ToList() : data.OrderBy(c => c.price).ToList();
					break;
				case "arge":
					data = search.SortDescending ? data.OrderByDescending(c => c.arge).ToList() : data.OrderBy(c => c.arge).ToList();
					break;
				default:
					data = search.SortDescending ? data.OrderByDescending(c => c.create_day).ToList() : data.OrderBy(c => c.create_day).ToList();
					break;
			}

			
			var roomDTOs = _mapper.Map<List<RoomDTO>>(data);

			return Ok(roomDTOs);
		}

	}
}
