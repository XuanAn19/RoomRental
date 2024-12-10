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
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Status> Status { get; set; }

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

            builder.Entity<Friend>(entity =>
            {
                entity.HasKey(f => f.Id);

                entity.HasOne(f => f.UserSend)
                    .WithMany(u => u.SentFriends)
                    .HasForeignKey(f => f.id_user_send)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(f => f.UserAccept)
                    .WithMany(u => u.ReceivedFriends)
                    .HasForeignKey(f => f.id_user_accept)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Status>(entity =>
            {
                entity.HasKey(f => f.Id);

                entity.HasOne(f => f.User)
                   .WithMany(u => u.UserStatuss)
                   .HasForeignKey(f => f.id_user)
                   .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
