using Microsoft.EntityFrameworkCore;
using LibraryApp.Model;

namespace LibraryApp.Data
{
    public class LibraryDbContext(DbContextOptions<LibraryDbContext> options) : DbContext(options)
    {
        public DbSet<Book> Books => Set<Book>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "1984",
                    Author = "George Orwell",
                    Description = "A dystopian novel set in a totalitarian society ruled by Big Brother.",
                    CreatedAt = new DateTime(2023, 1, 5, 8, 0, 0),
                    UpdatedAt = new DateTime(2023, 3, 10, 12, 0, 0)
                },
                new Book
                {
                    Id = 2,
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Description = "A novel about the serious issues",
                    CreatedAt = new DateTime(2023, 2, 10, 9, 30, 0),
                    UpdatedAt = new DateTime(2023, 4, 20, 10, 0, 0)
                },
                new Book
                {
                    Id = 3,
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Description = "A story about the American dream and the disillusionment of the Jazz Age.",
                    CreatedAt = new DateTime(2023, 1, 1, 10, 0, 0),
                    UpdatedAt = new DateTime(2023, 5, 15, 14, 45, 0)
                }
            );
        }
    }
}
