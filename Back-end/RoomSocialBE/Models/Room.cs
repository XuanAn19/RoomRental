using RoomSocialBE.Authentication;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RoomSocialBE.Models
{
    public class Room
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("User")]
        public string id_user { get; set; }
        [ForeignKey("Address")]
        public int id_adress { get; set; }
        public int id_category { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public double arge { get; set; }
        public float price { get; set; }
        public int quantity_room { get; set; }
        public string[] images { get; set; }
        public DateTime created_day { get; set; }
        public bool status { get; set; }

        // Liên kết
        public ApplicationUser User { get; set; }
        public Address Address { get; set; }
        public Category Category { get; set; }
        public ICollection<BookMark>? bookMarks { get; set; }
    }
}
