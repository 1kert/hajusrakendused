﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hajusrakendused.Migrations
{
    /// <inheritdoc />
    public partial class AddFavouriteGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "FavoriteGames",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteGames_UserId",
                table: "FavoriteGames",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteGames_AspNetUsers_UserId",
                table: "FavoriteGames",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteGames_AspNetUsers_UserId",
                table: "FavoriteGames");

            migrationBuilder.DropIndex(
                name: "IX_FavoriteGames_UserId",
                table: "FavoriteGames");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "FavoriteGames");
        }
    }
}
