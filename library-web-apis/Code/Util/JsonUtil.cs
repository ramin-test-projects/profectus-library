using System.Text.Json;

namespace LibraryWebApis;

public class JsonUtil
{
    public static string ToJson(dynamic json)
    {
        try
        {
            return JsonSerializer.Serialize(json);
        }
        catch // (JsonException ex)
        {
            return "";
        }
    }

    public static Dictionary<string, object?> FromJson(string? jsonString)
    {
        try
        {
            return string.IsNullOrWhiteSpace(jsonString) ? new Dictionary<string, object?>() :
                JsonSerializer.Deserialize<Dictionary<string, object?>>(jsonString) ?? new Dictionary<string, object?>();
        }
        catch // (JsonException ex)
        {
            return new Dictionary<string, object?>();
        }
    }

    public static T? FromJsonWithType<T>(string? jsonString)
    {
        try
        {
            return string.IsNullOrWhiteSpace(jsonString) ? default(T) :
                JsonSerializer.Deserialize<T>(jsonString) ?? default(T);
        }
        catch // (JsonException ex)
        {
            return default(T);
        }
    }
}
