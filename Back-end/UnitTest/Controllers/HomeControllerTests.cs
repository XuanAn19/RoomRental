using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory.Infrastructure.Internal;
using MockQueryable.EntityFrameworkCore;
using MockQueryable.FakeItEasy;
using Moq;
using RoomSocialBE.Authentication;
using RoomSocialBE.Controllers;
using RoomSocialBE.DTOs;
using RoomSocialBE.Map;
using RoomSocialBE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest.Controllers
{
    public class HomeControllerTests
    {


        [Fact]
        public async Task Search_Returns_OkResult()
        {
            // Arrange
            var dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "RoomSocialTestDB")
                .Options;
          
            using (var context = new ApplicationDbContext(dbContextOptions))
            {
               SeedData.Initialize(context);
                var roomCount = context.Rooms.Count(); // Đếm số lượng room trong bảng
                Console.WriteLine($"Room count: {roomCount}");


                var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context), null, null, null, null, null, null, null, null);

                var controller = new HomeController(context, userManager);
                var se = new SearchDTO { SearchName = "Phòng" };
                // Act
                var result = await controller.Search(se);

                // Assert
                var notFoundObjectResult = Assert.IsType<NotFoundObjectResult>(result);
                Assert.Equal("No data found", notFoundObjectResult.Value); 
            }
        }

    }

}


