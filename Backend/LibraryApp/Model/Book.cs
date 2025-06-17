using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LibraryApp.Dto;

namespace LibraryApp.Model
{
    public class Book
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 100 characters.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required.")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Author must be between 2 and 200 characters.")]
        public string Author { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = string.Empty;
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
