using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoomSocialBE.Migrations
{
    /// <inheritdoc />
    public partial class addfieldisCodeValid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "number_phone",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "is_verification_code_valid",
                table: "AspNetUsers",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_verification_code_valid",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "number_phone",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
