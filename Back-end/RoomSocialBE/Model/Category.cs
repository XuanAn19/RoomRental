using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Model
{
    public class Category
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }

    }
}
