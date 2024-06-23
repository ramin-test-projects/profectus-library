using System.Text.Json.Serialization;

namespace LibraryWebApis.Users.Models;

[Serializable]
public class User
{
    [JsonPropertyName("id")]
    public Guid? ID { get; set; }

    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [JsonPropertyName("GivenName")]
    public string? GivenName { get; set; }

    [JsonPropertyName("Surname")]
    public string? Surname { get; set; }
}
