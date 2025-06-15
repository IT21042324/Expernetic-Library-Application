using System.ComponentModel.DataAnnotations;

namespace LibraryApp.Dto
{
    public class BookDto
    {
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title Must be greater than 2 characters and less than 100 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(200, MinimumLength = 2, ErrorMessage = "Title Must be greater than 2 characters and less than 200 characters")]
        public string Author { get; set; } = string.Empty;

        [StringLength(2000, MinimumLength = 2, ErrorMessage = "Description Must be at least 2 characters")]
        public string? Description { get; set; }

        public readonly DateTime CreatedAt = DateTime.UtcNow;
        public readonly DateTime UpdatedAt = DateTime.UtcNow;
    }
}
