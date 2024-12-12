using Microsoft.AspNetCore.Identity;
using RoomSocialBE.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RoomSocialBE.Authentication
{
    public class ApplicationUser: IdentityUser
    {
        [Required]
        public string full_name { get; set; }

        public string? image { get; set; }

        public string? images_CCCD { get; set; }

        public int? email_code { get; set; }

        public bool? is_verification_code_valid { get; set; }

        public string? refresh_token { get; set; }

        public DateTime? refresh_token_expiry_time { get; set; }

        public bool? is_true { get; set; }
        public DateTime? Createdateerify { get; set; }

        public DateTime? UpdatedateVerify { get; set; }
        public ICollection<Room>? Rooms { get; set; }
        public ICollection<BookMark>? bookMarks { get; set; }

        public virtual ICollection<Friend> SentFriends { get; set; } = new HashSet<Friend>();

        public virtual ICollection<Friend> ReceivedFriends { get; set; } = new HashSet<Friend>();

        [JsonIgnore]
        public virtual ICollection<Status> UserStatuss { get; set; } = new HashSet<Status>();

    }
}
