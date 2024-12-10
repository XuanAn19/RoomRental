using RoomSocialBE.Authentication;
using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Models
{
    public class Status
    {
        public int Id { get; set; }

        [Required]
        public string id_user { get; set; }

        [Required(ErrorMessage = "Field 'content' is required")]
        public string content { get; set; }

        [Required]
        public DateTime creat_at { get; set; }

        [Required]
        public DateTime updated_at { get; set;}

        public virtual ApplicationUser User { get; set; } = null!;
    }
}
