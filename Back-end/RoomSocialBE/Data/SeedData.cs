using RoomSocialBE.Authentication;
using RoomSocialBE.Models;
using System;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace RoomSocialBE.Data
{
    public static class SeedData
        {
            public static async Task Initialize(IServiceProvider serviceProvider, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
            {
                var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

                if (!roleManager.Roles.Any())
                {
                    var roles = new string[] { "User", "Landlord", "Admin" };
                    foreach (var role in roles)
                    {
                        var roleExist = await roleManager.FindByNameAsync(role);
                        if (roleExist == null)
                        {
                            var identityRole = new IdentityRole(role);
                            await roleManager.CreateAsync(identityRole);
                        }
                    }
                }

                if (!userManager.Users.Any())
                {
                    var adminUser = new ApplicationUser
                    {
                        UserName = "admin@gmail.com",
                        Email = "admin@gmail.com",
                        full_name = "Admin",
                        EmailConfirmed = true
                    };

                    var adminResult = await userManager.CreateAsync(adminUser, "Admin@1234");
                    if (adminResult.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
                    }

                    var landlordUser = new ApplicationUser
                    {
                        UserName = "landlord@gmail.com",
                        Email = "landlord@gmail.com",
                        EmailConfirmed = true,
                        full_name = "Landlord"
                    };

                    var landlordResult = await userManager.CreateAsync(landlordUser, "Landlord@1234");
                    if (landlordResult.Succeeded)
                    {
                        await userManager.AddToRoleAsync(landlordUser, UserRoles.Landlord);
                    }

                    var normalUser = new ApplicationUser
                    {
                        UserName = "user@gmail.com",
                        Email = "user@gmail.com",
                        EmailConfirmed = true,
                        full_name = "User",
                        PasswordHash = "User@1234",
                        SecurityStamp = Guid.NewGuid().ToString(),
                        PhoneNumber = "0347019433",
                        email_code = null,
                    };

                    var userResult = await userManager.CreateAsync(normalUser, "User@1234");
                    if (userResult.Succeeded)
                    {
                        await userManager.AddToRoleAsync(normalUser, UserRoles.User);
                    }
                int a = 5;
                }

                if (!context.Categories.Any())
                {
                    context.Categories.AddRange(
                        new Category { name = "Nhà cấp 4" },
                        new Category { name = "Nhà 3 lầu" },
                        new Category { name = "Biệt thự" }
                    );
                    await context.SaveChangesAsync();
                }

                if (!context.Addresses.Any())
                {
                    context.Addresses.AddRange(
                        new Address { number_house = 15, street_name = "Hàn Mặc Tử", ward = "Phường Ghềnh Ráng", district = "TP Quy Nhơn", province = "Bình Định" },
                        new Address { number_house = 17, street_name = "Ngô Mây", ward = "Phường Ngô Mây", district = "TP Quy Nhơn", province = "Bình Định" },
                        new Address { number_house = 20, street_name = "Phạm Hùng", ward = "Phường Trần Phú", district = "TP Quy Nhơn", province = "Bình Định" }
                    );
                    await context.SaveChangesAsync();
                }

                if (!context.Rooms.Any())
                {
                    var category1 = context.Categories.FirstOrDefault(c => c.name == "Nhà cấp 4");
                    var category2 = context.Categories.FirstOrDefault(c => c.name == "Nhà 3 lầu");
                    var category3 = context.Categories.FirstOrDefault(c => c.name == "Biệt thự");

                    var address1 = context.Addresses.FirstOrDefault(a => a.number_house == 15);
                    var address2 = context.Addresses.FirstOrDefault(a => a.number_house == 17);
                    var address3 = context.Addresses.FirstOrDefault(a => a.number_house == 20);

                    var user = await userManager.FindByEmailAsync("user@gmail.com");

                context.Rooms.AddRange(
                    new Room
                    {
                        id_adress = address1.id,
                        id_category = category1.id,
                        id_user = user.Id,
                        title = "Nhà cấp 4 siêu vip pro",
                        description = "Nhà trống",
                        arge = 4.2, price = 800000,
                        quantity_room = 2, 
                        images = [],
                        created_day = DateTime.Now,
                        status = true },
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
                        images = [],
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
                        images = [],
                        created_day = DateTime.Now,
                        status = true
                    }
                );
                int b = 7;
                await context.SaveChangesAsync();
                }
            }
        }
}
