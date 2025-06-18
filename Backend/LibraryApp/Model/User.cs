using LibraryApp.Dto.Responses;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace LibraryApp.Model
{

    [Index(nameof(Username), IsUnique = true)]          
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public string PasswordHash { get; set; } = string.Empty;       
    }
}
