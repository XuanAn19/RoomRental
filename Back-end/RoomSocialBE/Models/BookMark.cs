using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using RoomSocialBE.Authentication;

namespace RoomSocialBE.Models
{
    public class BookMark
    {
        [Key]
        public int id { get; set; }
        [ForeignKey("Users")]
        public string id_user { get; set; }
        [ForeignKey("Rooms")]
        public int id_room { get; set; }


        public ApplicationUser? Users { get; set; }
        public Room? Rooms { get; set; }
    }
}
