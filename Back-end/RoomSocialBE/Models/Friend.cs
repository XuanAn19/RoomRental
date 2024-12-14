using RoomSocialBE.Authentication;
using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Models
{
    public class Friend
    {
        public int Id { get; set; }

        [Required]
        public string id_user_send { get; set; }

        public string  id_user_accept { get; set; }

        public bool is_friend { get; set; }

        public DateTime creat_at { get; set; }

        public DateTime updated_at { get; set;}

        public virtual ApplicationUser UserSend { get; set; } = null!;
        public virtual ApplicationUser UserAccept { get; set; } = null!;
    }
}
