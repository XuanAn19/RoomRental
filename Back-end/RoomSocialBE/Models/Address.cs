using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RoomSocialBE.Models
{
    public class Address
    {
        [Key]
        public int id { get; set; }
        public int number_house { get; set; }
        public string street_name { get; set; }
        public string ward { get; set; }
        public string district { get; set; }
        public string province { get; set; }

        // Liên kết
        [JsonIgnore]
        public ICollection<Room>? Rooms { get; set; }
    }
}
