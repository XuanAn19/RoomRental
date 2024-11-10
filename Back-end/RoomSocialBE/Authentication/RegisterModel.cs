using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Authentication
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "FullName is required")]
        public string FullName { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }

        [Required(ErrorMessage = "PhoneNumber is required")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
