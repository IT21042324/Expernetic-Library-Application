using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LibraryApp.Dto;

namespace LibraryApp.Model
{
    public class Book
    {
        public int Id { get; set; }

        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title Must be greater than 2 characters and less than 100 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(200, MinimumLength = 2, ErrorMessage = "Title Must be greater than 2 characters and less than 200 characters")]
        public string Author { get; set; } = string.Empty;

        [StringLength(2000, MinimumLength = 2, ErrorMessage = "Description Must be atleast 2 characters")]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Book() { }

        public Book(BookDto bookDto)
        {
            Title = bookDto.Title;
            Author = bookDto.Author;
            Description = bookDto.Description;
            CreatedAt = bookDto.CreatedAt;
        }

        public Book(BookDtoForUpdate bookDto)
        {
            Title = bookDto.Title;
            Author = bookDto.Author;
            Description = bookDto.Description;
        }
    }
}
