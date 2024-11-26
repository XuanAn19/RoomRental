using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RoomSocialBE.Models;

namespace RoomSocialBE.Authentication
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Room> Rooms { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Room>()
               .HasOne(r => r.User)
               .WithMany(u => u.Rooms)
               .HasForeignKey(r => r.id_user);

            builder.Entity<Room>()
                .HasOne(r => r.Address)
                .WithMany(a => a.Rooms)
                .HasForeignKey(r => r.id_adress);

            builder.Entity<Room>()
                .HasOne(r => r.Category)
                .WithMany(c => c.Rooms)
                .HasForeignKey(r => r.id_category);
        }
    }
}
