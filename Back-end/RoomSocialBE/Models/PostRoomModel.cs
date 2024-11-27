using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Models
{
    public class PostRoomModel
    {
        [Required(ErrorMessage = "id_user is required")]
        public string id_user { get; set; }

        [Required(ErrorMessage = "id_category is required")]
        public int id_category { get; set; }

        [Required(ErrorMessage = "id_address is required")]
        public Address address { get; set; }

        [Required(ErrorMessage = "title is required")]
        public string title { get; set; }

        [Required(ErrorMessage = "description is required")]
        public string description { get; set; }

        [Required(ErrorMessage = "arge is required")]
        public double arge { get; set; }

        [Required(ErrorMessage = "price is required")]
        public float price { get; set; }

        [Required(ErrorMessage = "quanity_room is required")]
        public int quanity_room { get; set; }

        public string[]? images { get; set; }
    }
}
