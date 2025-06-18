using LibraryApp.Model;

namespace LibraryApp.Dto.Responses
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Token { get; set; } = string.Empty;

        public UserResponse(User response)
        {
            Id = response.Id;
            Username = response.Username;
            PasswordHash = response.PasswordHash;
        }
    }
}
