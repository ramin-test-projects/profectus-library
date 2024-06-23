using System.Text.Json.Serialization;

namespace LibraryWebApis;

public class GenericApiResponse
{
    [JsonPropertyName("result")]
    public string? Result { get; set; }

    public GenericApiResponse(bool result)
    {
        Result = result ? "ok" : "nok";
    }
}
