namespace LibraryApp.Exceptions
{
    public class UserAlreadyExistsException(string username) : Exception($"User with username '{username}' already exists.") { 
    }
}
