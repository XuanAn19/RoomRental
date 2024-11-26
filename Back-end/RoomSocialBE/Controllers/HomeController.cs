using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoomSocialBE.Authentication;
using RoomSocialBE.DTOs;
using RoomSocialBE.Models;
using System.Linq;
using System.Threading.Tasks;
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
			var data = await _dataContext.Rooms
				.Include(r => r.User)
				.Include(r => r.Address)
				.Include(r => r.Category)
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
						a.Address.province.Contains(search.Address) ||
						a.Address.district.Contains(search.Address) ||
						a.Address.ward.Contains(search.Address) ||
						a.Address.street_name.Contains(search.Address)
					).ToList();
			}

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

			
			switch (search.SortBy.ToLower())
			{
				case "price":
					data = search.SortDescending ? data.OrderByDescending(c => c.price).ToList() : data.OrderBy(c => c.price).ToList();
					break;
				case "arge":
					data = search.SortDescending ? data.OrderByDescending(c => c.arge).ToList() : data.OrderBy(c => c.arge).ToList();
					break;
				default:
					data = search.SortDescending ? data.OrderByDescending(c => c.created_day).ToList() : data.OrderBy(c => c.created_day).ToList();
					break;
			}

			
			var roomDTOs = _mapper.Map<List<RoomDTO>>(data);

			return Ok(roomDTOs);
		}

	}
}
