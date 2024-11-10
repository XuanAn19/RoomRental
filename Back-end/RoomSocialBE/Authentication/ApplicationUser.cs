using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Authentication
{
    public class ApplicationUser: IdentityUser
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        public string PhoneNumber { get; set;}

        public string? AvatarUrl { get; set; }

        public string? ImagesCCCD { get; set; }

        public int? EmailCode { get; set; }
    }
}
