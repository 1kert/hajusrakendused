using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace hajusrakendused.Migrations
{
    /// <inheritdoc />
    public partial class BlogUserNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "Blogs",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_CreatedBy",
                table: "Blogs",
                column: "CreatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_AspNetUsers_CreatedBy",
                table: "Blogs",
                column: "CreatedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_AspNetUsers_CreatedBy",
                table: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_Blogs_CreatedBy",
                table: "Blogs");

            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedBy",
                table: "Blogs",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
