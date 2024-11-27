using RoomSocialBE.Authentication;
using RoomSocialBE.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.DTOs
{
	public class RoomDTO
	{
		public int id { get; set; }
		public string id_user { get; set; }
		public int id_address { get; set; }
		public int id_categoty { get; set; }
		public string title { get; set; }
		public string? description { get; set; }
		public float arge { get; set; } 
		public float price { get; set; } 
		public int quantity_room { get; set; }
		public string? images { get; set; }
		public DateTime create_day { get; set; } 
		public bool status { get; set; }
		public ApplicationUser user { get; set; }
		public Address? address { get; set; }
		public Category category { get; set; }
	}
}
