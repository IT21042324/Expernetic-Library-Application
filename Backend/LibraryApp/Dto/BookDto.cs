using System.ComponentModel.DataAnnotations;

namespace LibraryApp.Dto
{
    public class BookDto
    {
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Author is required.")]
        public string Author { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = string.Empty;

        public readonly DateTime CreatedAt = DateTime.UtcNow;
        public readonly DateTime UpdatedAt = DateTime.UtcNow;
    }
}
