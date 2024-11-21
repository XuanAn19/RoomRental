using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Authentication
{
	public class ChangePasswordModel
	{
		[Required]
		public string CurrentPassword { get; set; }

		[Required]
		[StringLength(20, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 20 characters.")]
		[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$")]
		public string NewPassword { get; set; }

		[Required]
		public string ConfirmPassword { get; set; }

	}
}
