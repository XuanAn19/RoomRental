using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using RoomSocialBE.Authentication;
using RoomSocialBE.Controllers;
using RoomSocialBE.DTOs;
using RoomSocialBE.Models;

using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using System.Linq.Expressions;

namespace RoomSocialBE.Tests.Controllers
{
    public class StatusControllerTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly DbContextOptions<ApplicationDbContext> _dbContextOptions;
        private readonly ApplicationDbContext _dbContext;
        private readonly StatusController _controller;

        public StatusControllerTests()
        {
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                new Mock<IUserStore<ApplicationUser>>().Object,
                null, null, null, null, null, null, null, null);

            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new ApplicationDbContext(_dbContextOptions);

            _controller = new StatusController(_dbContext, _mockUserManager.Object);
        }

        [Fact]
        public async Task CreateStatusWithUser_ShouldReturnBadRequest_WhenModelIsInvalid()
        {
            // Arrange
            var model = new StatusDTO(); 
            _controller.ModelState.AddModelError("content", "Content is required");

            // Act
            var result = await _controller.CreateStatusWithUser(model);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<Response>(badRequestResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("Invalid data provided.", response.Message);
        }

        [Fact]
        public async Task CreateStatusWithUser_ShouldReturnNotFound_WhenUserNotFound()
        {
            // Arrange
            var model = new StatusDTO
            {
                id_user = "non-existent-user-id",
                content = "Test content"
            };
            _mockUserManager.Setup(m => m.FindByIdAsync(model.id_user)).ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _controller.CreateStatusWithUser(model);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<Response>(notFoundResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("User not found.", response.Message);
        }

        [Fact]
        public async Task CreateStatusWithUser_ShouldReturnSuccess_WhenModelIsValid()
        {
            // Arrange
            var user = new ApplicationUser { Id = "test-user-id", UserName = "testuser", full_name = "A" };
            var model = new StatusDTO
            {
                id_user = user.Id,
                content = "This is a test status"
            };

            _mockUserManager.Setup(m => m.FindByIdAsync(user.Id)).ReturnsAsync(user);

            // Act
            var result = await _controller.CreateStatusWithUser(model);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<Response>(okResult.Value);
            Assert.Equal("Success", response.Status);
            Assert.Equal("Status created successfully.", response.Message);
        }
    }
}