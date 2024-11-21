using System.ComponentModel.DataAnnotations;

namespace RoomSocialBE.Authentication
{
	public class VerifyRegistration
	{


		[StringLength(50, MinimumLength = 4, ErrorMessage = "Họ tên phải có độ dài từ 4 đến 50 ký tự.")]
		public string FullName { get; set; }

		[StringLength(10, ErrorMessage = "Số điện thoại phải có đúng 10 chữ số.")]
		public string PhoneNumber { get; set; }


		public IFormFile ProfileImage { get; set; }


		public List<IFormFile> CccdImages { get; set; }
	}

}
