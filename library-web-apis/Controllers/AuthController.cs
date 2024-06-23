using LibraryWebApis.Users.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace LibraryWebApis.Controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly ControllerHelpers _helpers;

    public AuthController(ILogger<AuthController> logger, ControllerHelpers helpers)
    {
        _logger = logger;
        _helpers = helpers;
    }

    [HttpPost(template: "login", Name = "Login")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginApiResponse))]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<LoginApiResponse> Login([FromBody] LoginRequest input)
    {
        bool isAuthenticated = 
            ((input.Username ?? "").ToLower() == "admin" || (input.Username ?? "").ToLower() == "user") && 
            (input.Password ?? "").ToLower() == "123";
        bool isAdmin = (input.Username ?? "").ToLower() == "admin";

        if (!isAuthenticated) return Unauthorized();
        
        string token = AuthHelpers.GenerateJWTToken(
            user: new User() { Username = input.Username }, 
            secret: _helpers.AppSettings.JWT.Secret, 
            issuer: _helpers.AppSettings.JWT.Issuer,
            isAdmin: isAdmin);

        return Ok(new LoginApiResponse(input.Username ?? "", token, isAdmin));
    }
}

public class LoginRequest
{
    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [JsonPropertyName("password")]
    public string? Password { get; set; }
}

[Serializable]
public class LoginApiResponse
{
    [JsonPropertyName("username")]
    public string Username { get; set; }

    [JsonPropertyName("token")]
    public string Token { get; set; }

    [JsonPropertyName("isAdmin")]
    public bool IsAdmin { get; set; }

    public LoginApiResponse(string username, string token, bool isAdmin)
    {
        Username = username;
        Token = token;
        IsAdmin = isAdmin;
    }
}