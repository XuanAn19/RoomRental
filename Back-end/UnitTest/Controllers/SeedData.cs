using RoomSocialBE.Authentication;
using RoomSocialBE.Models;
using System;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

public static class SeedData
{
    public static async Task Initialize(ApplicationDbContext context)
    {
        // Set up in-memory database options
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "RoomSocialTestDB")
            .Options;
        // Configure services
        var services = new ServiceCollection();
        services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("RoomSocialTestDB"))
            .AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var serviceProvider = services.BuildServiceProvider();

        // Get the necessary services
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Seed roles
        if (!roleManager.Roles.Any())
        {
            var roles = new[] { "User", "Landlord", "Admin" };
            foreach (var role in roles)
            {
                if (await roleManager.FindByNameAsync(role) == null)
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        // Seed users
        if (!userManager.Users.Any())
        {
            var adminUser = new ApplicationUser
            {
                UserName = "admin@gmail.com",
                Email = "admin@gmail.com",
                full_name = "Admin",
                EmailConfirmed = true
            };
            if ((await userManager.CreateAsync(adminUser, "Admin@1234")).Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            var landlordUser = new ApplicationUser
            {
                UserName = "landlord@gmail.com",
                Email = "landlord@gmail.com",
                full_name = "Landlord",
                EmailConfirmed = true
            };
            if ((await userManager.CreateAsync(landlordUser, "Landlord@1234")).Succeeded)
            {
                await userManager.AddToRoleAsync(landlordUser, "Landlord");
            }

            var normalUser = new ApplicationUser
            {
                UserName = "user@gmail.com",
                Email = "user@gmail.com",
                full_name = "User",
                EmailConfirmed = true
            };
            if ((await userManager.CreateAsync(normalUser, "User@1234")).Succeeded)
            {
                await userManager.AddToRoleAsync(normalUser, "User");
            }
        }

        // Seed categories
        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { name = "Nhà cấp 4" },
                new Category { name = "Nhà 3 lầu" },
                new Category { name = "Biệt thự" },
                new Category { name = "Tìm ở ghép" }
            );
            await context.SaveChangesAsync();
        }

        // Seed addresses
        if (!context.Addresses.Any())
        {
            context.Addresses.AddRange(
                new Address { number_house = 15, street_name = "Hàn Mặc Tử", ward = "Phường Ghềnh Ráng", district = "TP Quy Nhơn", province = "Bình Định" },
                new Address { number_house = 17, street_name = "Ngô Mây", ward = "Phường Ngô Mây", district = "TP Quy Nhơn", province = "Bình Định" },
                new Address { number_house = 20, street_name = "Phạm Hùng", ward = "Phường Trần Phú", district = "TP Quy Nhơn", province = "Bình Định" },
                new Address { number_house = 10, street_name = "Nguyễn Đình Thụ", ward = "Phường Nguyễn Văn Cừ", district = "TP Quy Nhơn", province = "Bình Định" }
            );
            await context.SaveChangesAsync();
        }

        // Seed rooms
        if (!context.Rooms.Any())
        {
            var category1 = context.Categories.FirstOrDefault(c => c.name == "Nhà cấp 4");
            var category2 = context.Categories.FirstOrDefault(c => c.name == "Nhà 3 lầu");
            var category3 = context.Categories.FirstOrDefault(c => c.name == "Biệt thự");
            var category4 = context.Categories.FirstOrDefault(c => c.name == "Tìm ở ghép");

            var address1 = context.Addresses.FirstOrDefault(a => a.number_house == 15);
            var address2 = context.Addresses.FirstOrDefault(a => a.number_house == 17);
            var address3 = context.Addresses.FirstOrDefault(a => a.number_house == 20);
            var address4 = context.Addresses.FirstOrDefault(a => a.number_house == 10);

            var user = await userManager.FindByEmailAsync("user@gmail.com");

            context.Rooms.AddRange(
                new Room
                {
                    id_adress = address1.id,
                    id_category = category1.id,
                    id_user = user.Id,
                    title = "Nhà cấp 4 siêu vip pro",
                    description = "Nhà trống",
                    arge = 4.2,
                    price = 800000,
                    quantity_room = 2,
                    images = Array.Empty<string>(),
                    created_day = DateTime.Now,
                    status = true
                },
                new Room
                {
                    id_adress = address2.id,
                    id_category = category2.id,
                    id_user = user.Id,
                    title = "Nhà Lầu có ma",
                    description = "Nhà trống lổng trống lơ",
                    arge = 50.25,
                    price = 5500,
                    quantity_room = 6,
                    images = Array.Empty<string>(),
                    created_day = DateTime.Now,
                    status = true
                },
                new Room
                {
                    id_adress = address3.id,
                    id_category = category3.id,
                    id_user = user.Id,
                    title = "Biệt thự công chúa Phạm Hùng",
                    description = "Biệt thự tráng P2",
                    arge = 49.53,
                    price = 10000,
                    quantity_room = 2,
                    images = Array.Empty<string>(),
                    created_day = DateTime.Now,
                    status = true
                },
                new Room
                {
                    id_adress = address4.id,
                    id_category = category4.id,
                    id_user = user.Id,
                    title = "Tìm bạn owg ghép",
                    description = "Trọ đang trống 1 slot",
                    arge = 4.2,
                    price = 20000,
                    quantity_room = 2,
                    images = Array.Empty<string>(),
                    created_day = DateTime.Now,
                    status = true
                }
            );
            await context.SaveChangesAsync();
        }
    }
}

