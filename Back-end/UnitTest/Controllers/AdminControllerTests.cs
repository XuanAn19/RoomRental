using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory.Query.Internal;
using Moq;
using Moq.EntityFrameworkCore;
using RoomSocialBE.Authentication;
using RoomSocialBE.Controllers;
using RoomSocialBE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest.Controllers
{
    public class AdminControllerTests
    {
       // [Fact]
        public async Task GetNonLandlordUsers_ReturnsOkResult()
        {
            // Arrange
            var users = new List<ApplicationUser>
            {
                new ApplicationUser { Id = "1", Email = "user1@gmail.com", UserName = "user1", is_true = false },
                new ApplicationUser { Id = "2", Email = "user2@gmail.com", UserName = "user2", is_true = false }
            }.AsQueryable();

            var roles = new List<IdentityRole>
            {
                new IdentityRole { Id = "role-user-id", Name = "User" }
            }.AsQueryable();

            var mockContext = new Mock<ApplicationDbContext>();
            mockContext.Setup(c => c.Users).ReturnsDbSet(users);
            mockContext.Setup(c => c.Roles).ReturnsDbSet(roles);

            var controller = new AdminController(mockContext.Object, null);

            // Act
            var result = await controller.GetNonLandlordUsers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedUsers = Assert.IsAssignableFrom<List<ApplicationUser>>(okResult.Value);
            Assert.Equal(2, returnedUsers.Count); 
        }


        [Fact]
        public async Task Confirm_ReturnsOkResult()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", UserName = "user1", Email = "user1@example.com", is_true = false };

            var mockContext = new Mock<ApplicationDbContext>();
            mockContext.Setup(c => c.Users).ReturnsDbSet(new List<ApplicationUser> { user }.AsQueryable());

            var userManagerMock = new Mock<UserManager<ApplicationUser>>(
                Mock.Of<IUserStore<ApplicationUser>>(),
                null, null, null, null, null, null, null, null);

            userManagerMock.Setup(um => um.IsInRoleAsync(user, "User")).ReturnsAsync(true);
            userManagerMock.Setup(um => um.RemoveFromRoleAsync(user, "User")).ReturnsAsync(IdentityResult.Success);
            userManagerMock.Setup(um => um.AddToRoleAsync(user, "Landlord")).ReturnsAsync(IdentityResult.Success);

            var controller = new AdminController(mockContext.Object, userManagerMock.Object);

            // Act
            var result = await controller.Confirm("1");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            dynamic response = okResult.Value; ; // Ép kiểu sang dynamic hoặc một kiểu cụ thể nếu cần
            var status = response;
            // Kiểm tra logic cập nhật
            Assert.True(user.is_true);
            userManagerMock.Verify(um => um.AddToRoleAsync(user, "Landlord"), Times.Once);
            userManagerMock.Verify(um => um.RemoveFromRoleAsync(user, "User"), Times.Once);

         
            
            Assert.Equal(200, okResult.StatusCode);
            Assert.NotNull(response); // Đảm bảo response không null
/*            Assert.Equal("oke", response?.status);
            Assert.Equal("User role updated to Landlord successfully.", response?.message);*/

           
        }
    }
}
