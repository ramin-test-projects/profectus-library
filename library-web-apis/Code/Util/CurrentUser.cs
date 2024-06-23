using LibraryWebApis.Users.Models;
using System.Security.Claims;

namespace LibraryWebApis;

public class CurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? GetPrincipalUser()
    {
        return _httpContextAccessor.HttpContext?.User;
    }

    public bool IsAdmin
    {
        get
        {
            var principalUser = GetPrincipalUser();
            return principalUser?.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == "admin") ?? false;
        }
    }

    public User GetUser()
    {
        var principalUser = GetPrincipalUser();

        return new User()
        {
            ID = Parsers.ParseGuid(principalUser?.FindFirstValue(ClaimTypes.NameIdentifier) ?? ""),
            Username = principalUser?.FindFirstValue(ClaimTypes.Name) ?? "",
            GivenName = principalUser?.FindFirstValue(ClaimTypes.GivenName) ?? "",
            Surname = principalUser?.FindFirstValue(ClaimTypes.Surname) ?? "",
        };
    }
}
