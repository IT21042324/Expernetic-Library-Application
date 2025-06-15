using System.ComponentModel.DataAnnotations;

namespace LibraryApp.Dto
{
    public class BookDtoForUpdate
    {
        
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? Description { get; set; }
    }
}
