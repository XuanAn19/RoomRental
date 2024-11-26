using RoomSocialBE.Authentication;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RoomSocialBE.Model
{
    public class Room
    {
        [Key]
        public int id { get; set; }
        public string id_user { get; set; }
        public int id_address { get; set; }
        public int id_categoty { get; set; }

        [Required]
        [MaxLength(10)]
        public string title { get; set; }

        public string? description { get; set; }

        [Required]
        public float arge { get; set; } // Diện tích phòng

        [Required]
        public float price { get; set; } // Giá thuê phòng

        [Required]
        public int quantity_room { get; set; } // Số lượng phòng

        public string? images { get; set; } // Hình ảnh phòng
        [NotMapped]
		public IFormFile? upLoadfiles { get; set; }
		[Required]
        public DateTime create_day { get; set; } // Ngày tạo

        [Required]
        public bool status { get; set; } // Trạng thái phòng (còn trống/đã thuê)
        [ForeignKey("id_user")]
        public ApplicationUser user { get; set; }
        [ForeignKey("id_address")]
        public Address? address { get; set; }
        [ForeignKey("id_categoty")]
        public Category category { get; set; }
    }
}
