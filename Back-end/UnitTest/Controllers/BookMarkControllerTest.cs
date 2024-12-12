using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RoomSocialBE.Authentication;
using RoomSocialBE.Models;
using Xunit;

namespace RoomSocialBE.Tests
{
    public class BookMarkControllerTest
    {
        [Fact]
        public async Task AddBookMarkAsync_ValidData_ReturnsTrue()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "AddBookMarkAsync_ValidData_ReturnsTrue")
                .Options;

            using (var context = new ApplicationDbContext(options))
            {
                var bookmark = new BookMark
                {
                    id_user = "user1",
                    id_room = 1
                };

                context.bookMarks.Add(bookmark);
                await context.SaveChangesAsync();
            }

            using (var context = new ApplicationDbContext(options))
            {
                // Act
                var bookmark = await context.bookMarks.FirstOrDefaultAsync();

                // Assert
                Assert.NotNull(bookmark);
                Assert.Equal("user1", bookmark.id_user);
                Assert.Equal(1, bookmark.id_room);
            }
        }

        [Fact]
        public async Task RemoveBookMarkAsync_ValidData_ReturnsTrue()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "RemoveBookMarkAsync_ValidData_ReturnsTrue")
                .Options;

            using (var context = new ApplicationDbContext(options))
            {
                var bookmark = new BookMark
                {
                    id_user = "user1",
                    id_room = 1
                };

                context.bookMarks.Add(bookmark);
                await context.SaveChangesAsync();
            }

            using (var context = new ApplicationDbContext(options))
            {
                // Act
                var bookmark = await context.bookMarks.FirstOrDefaultAsync();
                context.bookMarks.Remove(bookmark);
                await context.SaveChangesAsync();
            }

            using (var context = new ApplicationDbContext(options))
            {
                // Assert
                var bookmark = await context.bookMarks.FirstOrDefaultAsync();
                Assert.Null(bookmark);
            }
        }

    }
}