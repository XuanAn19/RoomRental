using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoomSocialBE.Migrations
{
    /// <inheritdoc />
    public partial class deletefieldidRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "id_role",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "refresh_token",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "refresh_token_expiry_time",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "refresh_token",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "refresh_token_expiry_time",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "id_role",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
