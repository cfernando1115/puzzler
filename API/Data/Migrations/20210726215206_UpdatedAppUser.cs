using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class UpdatedAppUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_AspNetUsers_AppUserId",
                table: "Games");

            migrationBuilder.DropIndex(
                name: "IX_Games_AppUserId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Games");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Games",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Games_AppUserId",
                table: "Games",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_AspNetUsers_AppUserId",
                table: "Games",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
