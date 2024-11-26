using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Model
{
    public class Address
    {
        [Key]
        public int id { get; set; } // Khóa chính.

        public int? number_house { get; set; } // Số nhà.

        [MaxLength(100)]
        public string? street_name { get; set; } // Tên đường.

        [MaxLength(100)]
        public string? ward { get; set; } // Xã/Phường.

        [MaxLength(100)]
        public string? district { get; set; } // Quận/Huyện.

        [MaxLength(100)]
        public string? province { get; set; } // Tỉnh.
    }
}
