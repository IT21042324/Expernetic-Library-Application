using LibraryApp.Data;
using LibraryApp.Dto;
using LibraryApp.Dto.Responses;
using LibraryApp.Exceptions;
using LibraryApp.Model;
using Microsoft.EntityFrameworkCore;

namespace LibraryApp.Service
{
    public sealed class UserService(LibraryDbContext _context)
    {
        public async Task<UserResponse> RegisterUserAsync(RegisterDto dto)
        {

            var doesAUserExistWithSameUserName = await _context.Users.AnyAsync(u => u.Username == dto.Username);
            if(doesAUserExistWithSameUserName)
            {
                throw new UserAlreadyExistsException(dto.Username);
            }                

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserResponse(user);
        }

        public async Task<UserResponse> LoginUserAsync(LoginDto dto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
            if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new InvalidCredentialsException();

            return new UserResponse(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user is null)
                throw new NotFoundException($"User with ID {id} not found.");
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserByUsername(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (user is null)
                throw new NotFoundException($"User with username {username} not found.");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
