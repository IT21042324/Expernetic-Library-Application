using LibraryApp.Model;

namespace LibraryApp.Dto.Responses
{
    public class DeleteBookResponse(Book book)
    {
        public int Id { get; set; } = book.Id;                      
        public string Title { get; set; } = book.Title;
        public string Author { get; set; } = book.Author;
        public DateTime DeletedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Book Deleted"; 
        public string Message { get; set; } = "The book has been successfully deleted.";
    }
}