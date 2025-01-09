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
    public class FriendsControllerTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly DbContextOptions<ApplicationDbContext> _dbContextOptions;
        private readonly ApplicationDbContext _dbContext;
        private readonly FriendsController _controller;

        public FriendsControllerTests()
        {
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                new Mock<IUserStore<ApplicationUser>>().Object,
                null, null, null, null, null, null, null, null);

            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new ApplicationDbContext(_dbContextOptions);

            _controller = new FriendsController(_dbContext, _mockUserManager.Object);
        }

        // CreateFriendRequest
        [Fact]
        public async Task CreateFriendRequest_ShouldReturnBadRequest_WhenIdsAreNull()
        {
            // Arrange
            var friendRequest = new FriendRequestDTO { id_user_send = null, id_user_accept = null };

            // Act
            var result = await _controller.CreateFriendRequest(friendRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<Response>(badRequestResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("id_user_send and id_user_accept are required.", response.Message);
        }

        [Fact]
        public async Task CreateFriendRequest_ShouldReturnBadRequest_WhenIdsOverlap()
        {
            // Arrange
            var friendRequest = new FriendRequestDTO { id_user_send = "user1", id_user_accept = "user1" };

            // Act
            var result = await _controller.CreateFriendRequest(friendRequest);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<Response>(badRequestResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("id_user_send and id_user_accept overlap.", response.Message);
        }

        [Fact]
        public async Task CreateFriendRequest_ShouldReturnNotFound_WhenSenderDoesNotExist()
        {
            // Arrange
            var friendRequest = new FriendRequestDTO { id_user_send = "user1", id_user_accept = "user2" };

            _mockUserManager.Setup(um => um.FindByIdAsync("user1")).ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _controller.CreateFriendRequest(friendRequest);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<Response>(notFoundResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("Sender with ID user1 not found in system.", response.Message);
        }

        [Fact]
        public async Task CreateFriendRequest_ShouldReturnNotFound_WhenReceiverDoesNotExist()
        {
            // Arrange
            var sender = new ApplicationUser { Id = "user1", full_name = "A", UserName = "Sender", Email = "user@gmail.com" };

            var friendRequest = new FriendRequestDTO { id_user_send = "user1", id_user_accept = "user2" };

            _mockUserManager.Setup(um => um.FindByIdAsync("user1")).ReturnsAsync(sender);
            _mockUserManager.Setup(um => um.FindByIdAsync("user2")).ReturnsAsync((ApplicationUser)null); 

            // Act
            var result = await _controller.CreateFriendRequest(friendRequest);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<Response>(notFoundResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("Receiver with ID user2 not found in system.", response.Message);
        }

        [Fact]
        public async Task CreateFriendRequest_ShouldReturnSuccess_WhenRequestIsValid()
        {
            // Arrange
            var sender = new ApplicationUser { Id = "user1", full_name = "A", UserName = "Sender" };
            var receiver = new ApplicationUser { Id = "user2", full_name = "B", UserName = "Receiver" };
            var friendRequest = new FriendRequestDTO { id_user_send = "user1", id_user_accept = "user2" };

            _mockUserManager.Setup(um => um.FindByIdAsync("user1")).ReturnsAsync(sender);
            _mockUserManager.Setup(um => um.FindByIdAsync("user2")).ReturnsAsync(receiver);

            // Act
            var result = await _controller.CreateFriendRequest(friendRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<Response>(okResult.Value);
            Assert.Equal("Success", response.Status);
            Assert.Equal("Friend request created successfully.", response.Message);
        }

        // AcceptFriendRequest
        [Fact]
        public async Task AcceptFriendRequest_ShouldReturnBadRequest_WhenIdIsInvalid()
        {
            // Arrange
            int invalidId = -1;

            // Act
            var result = await _controller.AcceptFriendRequest(invalidId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<Response>(badRequestResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("Invalid Friend Request ID.", response.Message);
        }

        [Fact]
        public async Task AcceptFriendRequest_ShouldReturnNotFound_WhenRequestDoesNotExist()
        {
            // Arrange
            int nonExistentId = 999;

            // Act
            var result = await _controller.AcceptFriendRequest(nonExistentId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<Response>(notFoundResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal($"Friend request with ID {nonExistentId} not found.", response.Message);
        }

        [Fact]
        public async Task AcceptFriendRequest_ShouldReturnBadRequest_WhenRequestAlreadyAccepted()
        {
            // Arrange
            var friendRequestId = 1;
            var friendRequest = new Friend { id_user_send = "user1", id_user_accept = "user2", is_friend = true };

            // Mock DbSet<Friend>
            var mockFriendsDbSet = new Mock<DbSet<Friend>>();

            // Mock FindAsync method
            mockFriendsDbSet.Setup(m => m.FindAsync(friendRequestId)).ReturnsAsync(friendRequest);

            // Mock DbContext to return the mocked DbSet<Friend>
            _dbContext.Friends = mockFriendsDbSet.Object;

            // Act
            var result = await _controller.AcceptFriendRequest(friendRequestId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<Response>(badRequestResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("Friend request is already accepted.", response.Message);
        }

        [Fact]
        public async Task AcceptFriendRequest_ShouldReturnSuccess_WhenRequestIsValid()
        {
            // Arrange
            var friendRequestId = 1;
            var friendRequest = new Friend { id_user_send = "user1", id_user_accept = "user2", is_friend = false };

            // Sử dụng _dbContext để mock FindAsync
            var mockFriendsDbSet = new Mock<DbSet<Friend>>();
            mockFriendsDbSet
                .Setup(m => m.FindAsync(friendRequestId))
                .ReturnsAsync(friendRequest);

            // Gán mock DbSet vào _dbContext
            _dbContext.Friends = mockFriendsDbSet.Object;

            // Act
            var result = await _controller.AcceptFriendRequest(friendRequestId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<Response>(okResult.Value);
            Assert.Equal("Success", response.Status);
            Assert.Equal("Friend request accepted successfully.", response.Message);
        }

        // DeleteFriendRequest
        [Fact]
        public async Task DeleteFriendRequest_ShouldReturnBadRequest_WhenIdIsInvalid()
        {
            // Arrange
            int invalidId = -1;

            // Act
            var result = await _controller.DeleteFriendRequest(invalidId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            var response = Assert.IsType<Response>(badRequestResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal("Invalid Friend Request ID.", response.Message);
        }

        [Fact]
        public async Task DeleteFriendRequest_ShouldReturnNotFound_WhenRequestDoesNotExist()
        {
            // Arrange
            int nonExistentId = 999;

            // Act
            var result = await _controller.DeleteFriendRequest(nonExistentId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var response = Assert.IsType<Response>(notFoundResult.Value);
            Assert.Equal("Fail", response.Status);
            Assert.Equal($"Friend request with ID {nonExistentId} not found.", response.Message);
        }

        [Fact]
        public async Task DeleteFriendRequest_ShouldReturnSuccess_WhenRequestIsExist()
        {
            // Arrange
            int friendRequestId = 1;
            var friendRequest = new Friend { id_user_send = "user1", id_user_accept = "user2", is_friend = false };

            // Mock DbSet<Friend>
            var mockFriendsDbSet = new Mock<DbSet<Friend>>();

            // Mock FindAsync method
            mockFriendsDbSet.Setup(m => m.FindAsync(friendRequestId)).ReturnsAsync(friendRequest);

            // Mock DbContext to return the mocked DbSet<Friend>
            _dbContext.Friends = mockFriendsDbSet.Object;

            // Act
            var result = await _controller.DeleteFriendRequest(friendRequestId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<Response>(okResult.Value);
            Assert.Equal("Success", response.Status);
            Assert.Equal("Friend request deleted successfully.", response.Message);
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}