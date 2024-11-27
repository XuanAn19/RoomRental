using AutoMapper;
using RoomSocialBE.DTOs;
using RoomSocialBE.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RoomSocialBE.Map
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			// Ánh xạ từ Room sang RoomDTO
			CreateMap<Room, RoomDTO>()
				.ForMember(dest => dest.user, opt => opt.MapFrom(src => src.User))  // Ánh xạ user
				.ForMember(dest => dest.address, opt => opt.MapFrom(src => src.Address))  // Ánh xạ address
				.ForMember(dest => dest.category, opt => opt.MapFrom(src => src.Category));  // Ánh xạ category
		}
	}
}
