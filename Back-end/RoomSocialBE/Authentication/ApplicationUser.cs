using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

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

        public bool? is_true { get; set; }
	}
}
