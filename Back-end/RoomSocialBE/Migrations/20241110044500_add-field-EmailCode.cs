using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoomSocialBE.Migrations
{
    /// <inheritdoc />
    public partial class addfieldEmailCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmailCode",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailCode",
                table: "AspNetUsers");
        }
    }
}
