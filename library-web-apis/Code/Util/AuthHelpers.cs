using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibraryWebApis.Users.Models;

public class AuthHelpers
{
    public static string GenerateJWTToken(User user, string secret, string issuer, bool isAdmin)
    {
        var claims = new List<Claim> {
            new Claim(ClaimTypes.NameIdentifier, user.ID?.ToString() ?? ""),
            new Claim(ClaimTypes.Name, user.Username ?? ""),
            new Claim(ClaimTypes.GivenName, user.GivenName ?? ""),
            new Claim(ClaimTypes.Surname, user.Surname ?? ""),
            new Claim(ClaimTypes.Role, isAdmin ? "admin" : ""),
        }
        .Where(c => !string.IsNullOrEmpty(c.Value));

        var jwtToken = new JwtSecurityToken(
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddDays(30),
            issuer: issuer,
            audience: issuer,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                SecurityAlgorithms.HmacSha256Signature)
        );

        return new JwtSecurityTokenHandler().WriteToken(jwtToken);
    }
}
