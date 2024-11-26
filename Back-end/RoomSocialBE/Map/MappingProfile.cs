using AutoMapper;
using RoomSocialBE.DTOs;
using RoomSocialBE.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace RoomSocialBE.Map
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			// Ánh xạ từ Room sang RoomDTO
			CreateMap<Room, RoomDTO>()
				.ForMember(dest => dest.user, opt => opt.MapFrom(src => src.user))  // Ánh xạ user
				.ForMember(dest => dest.address, opt => opt.MapFrom(src => src.address))  // Ánh xạ address
				.ForMember(dest => dest.category, opt => opt.MapFrom(src => src.category));  // Ánh xạ category
		}
	}
}
