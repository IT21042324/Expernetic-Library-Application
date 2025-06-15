using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LibraryApp.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "CreatedAt", "Description", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "George Orwell", new DateTime(2023, 1, 5, 8, 0, 0, 0, DateTimeKind.Unspecified), "A dystopian novel set in a totalitarian society ruled by Big Brother.", "1984", new DateTime(2023, 3, 10, 12, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, "Harper Lee", new DateTime(2023, 2, 10, 9, 30, 0, 0, DateTimeKind.Unspecified), "A novel about the serious issues", "To Kill a Mockingbird", new DateTime(2023, 4, 20, 10, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, "F. Scott Fitzgerald", new DateTime(2023, 1, 1, 10, 0, 0, 0, DateTimeKind.Unspecified), "A story about the American dream and the disillusionment of the Jazz Age.", "The Great Gatsby", new DateTime(2023, 5, 15, 14, 45, 0, 0, DateTimeKind.Unspecified) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Books");
        }
    }
}
