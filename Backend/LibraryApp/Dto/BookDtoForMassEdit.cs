using System.ComponentModel.DataAnnotations;

namespace LibraryApp.Dto
{
    public class BookDtoForMassEdit : BookDtoForUpdate
    {
        [Required(ErrorMessage = "Id is required")]
        public int Id { get; set; }
    }
    
}
