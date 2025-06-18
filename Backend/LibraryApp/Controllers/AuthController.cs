using LibraryApp.Dto;
using LibraryApp.Dto.Responses;
using LibraryApp.Service;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(TokenService token, UserService userService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult<UserResponse>> Login([FromBody] LoginDto request)
        {
            var user = await userService.LoginUserAsync(request);
            user.Token = token.GenerateToken(user.Username);
            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterDto request)
        {
            var user = await userService.RegisterUserAsync(request);
            user.Token = token.GenerateToken(user.Username);
            return CreatedAtAction(nameof(Register), new { id = user.Id }, user); // returns 201 Created with the user object
        }

        // These endpoints are for deleting users by ID or username
        // These are test endpoints for me to delete the users I created during testing
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            await userService.DeleteUserAsync(id);
            return NoContent(); // returns 204 No Content on successful deletion
        }

        [HttpDelete("username/{username}")]
        public async Task<ActionResult> DeleteUserByUsername(string username)
        {
            await userService.DeleteUserByUsername(username);
            return NoContent(); // returns 204 No Content on successful deletion
        }
    }
}
