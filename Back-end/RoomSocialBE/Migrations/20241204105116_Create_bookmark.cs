using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RoomSocialBE.Migrations
{
    /// <inheritdoc />
    public partial class Create_bookmark : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bookMarks",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id_user = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    id_room = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookMarks", x => x.id);
                    table.ForeignKey(
                        name: "FK_bookMarks_AspNetUsers_id_user",
                        column: x => x.id_user,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bookMarks_Rooms_id_room",
                        column: x => x.id_room,
                        principalTable: "Rooms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_bookMarks_id_room",
                table: "bookMarks",
                column: "id_room");

            migrationBuilder.CreateIndex(
                name: "IX_bookMarks_id_user",
                table: "bookMarks",
                column: "id_user");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bookMarks");
        }
    }
}
