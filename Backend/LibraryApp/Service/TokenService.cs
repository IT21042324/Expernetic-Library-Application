using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using LibraryApp.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LibraryApp.Service
{
    // we use this service to generate tokens for your users after his un and pwd is correctly validated
    public sealed class TokenService(IOptions<JwtSettings> opts)
    {
        private readonly JwtSettings _jwt = opts.Value;

        public string GenerateToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(_jwt.Key).ToArray(); // key is there to sign the token.

            //claims define the payload of the token
            var claims = new List<Claim> 
            {
                //claim has a type and a value, here we use the username as the name claim. type is like a key
                new Claim(ClaimTypes.Name, username),
            };

            // token descriptor is used to create the token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims), //subject is the identity of the user, which contains the claims
                Expires = DateTime.UtcNow.AddMinutes(_jwt.ExpiresInMinutes), // token will expire in 1 hour
                Issuer = _jwt.Issuer, // issuer is the entity that issues the token, can be domain or application name
                Audience = _jwt.Audience, // audience is the entity that the token is intended for, can be domain or application name
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) // im using HMAC SHA256 to sign the token. it is a symmetric algorithm, meaning the same key is used to sign and verify the token
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token); // this will return the token as a string
        }
    }
}
