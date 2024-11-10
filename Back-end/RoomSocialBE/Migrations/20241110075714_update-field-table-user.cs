using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoomSocialBE.Migrations
{
    /// <inheritdoc />
    public partial class updatefieldtableuser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImagesCCCD",
                table: "AspNetUsers",
                newName: "images_CCCD");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "AspNetUsers",
                newName: "number_phone");

            migrationBuilder.RenameColumn(
                name: "EmailCode",
                table: "AspNetUsers",
                newName: "email_code");

            migrationBuilder.RenameColumn(
                name: "AvatarUrl",
                table: "AspNetUsers",
                newName: "image");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "full_name",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "id_role",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "full_name",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "id_role",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "number_phone",
                table: "AspNetUsers",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "images_CCCD",
                table: "AspNetUsers",
                newName: "ImagesCCCD");

            migrationBuilder.RenameColumn(
                name: "image",
                table: "AspNetUsers",
                newName: "AvatarUrl");

            migrationBuilder.RenameColumn(
                name: "email_code",
                table: "AspNetUsers",
                newName: "EmailCode");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
