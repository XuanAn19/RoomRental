using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RoomSocialBE.Models;
using System.Reflection.Emit;

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
        public DbSet<BookMark> bookMarks { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
			builder.Entity<Room>()
	   .HasOne(r => r.Address)
	   .WithMany(a => a.Rooms)
	   .HasForeignKey(r => r.id_adress)
	   .OnDelete(DeleteBehavior.Cascade);
			builder.Entity<Room>()
	  .HasOne(r => r.Category)
	  .WithMany(c => c.Rooms)
	  .HasForeignKey(r => r.id_category)
	  .OnDelete(DeleteBehavior.Cascade);
		}
    }
}
