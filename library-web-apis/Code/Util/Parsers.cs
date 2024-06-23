namespace LibraryWebApis;

public class Parsers
{
    public static int? ParseInt(string? input, int? defaultValue = null, int? maxValue = null)
    {
        if (string.IsNullOrEmpty(input)) return defaultValue;
        int retVal = 0;
        if (!int.TryParse(input, out retVal)) return defaultValue;
        return Math.Min(retVal, maxValue ?? retVal);
    }

    public static long? ParseLong(string? input, long? defaultValue = null)
    {
        if (string.IsNullOrEmpty(input)) return defaultValue;
        long retVal = 0;
        if (!long.TryParse(input, out retVal)) return defaultValue;
        return retVal;
    }

    public static double? ParseDouble(string? input, double? defaultValue = null)
    {
        if (string.IsNullOrEmpty(input)) return defaultValue;
        double retVal = 0;
        if (!double.TryParse(input, out retVal)) return defaultValue;
        return double.IsNaN(retVal) || double.IsInfinity(retVal) ? null : (double?)retVal;
    }

    public static bool? ParseBool(string? input, bool? defaultValue = null)
    {
        int intValue = 0;

        if (string.IsNullOrEmpty(input)) return defaultValue;
        else if (input.ToLower() == "true" || (int.TryParse(input, out intValue) && intValue > 0)) return true;
        else if (input.ToLower() == "false" || input == "0") return false;
        else return defaultValue;
    }

    public static DateTime? ParseDate(string? input, int days2Add = 0)
    {
        try { 
            return string.IsNullOrEmpty(input) ? null : DateTime.Parse(input).AddDays(days2Add); 
        }
        catch { return null; }
    }

    public static Guid? ParseGuid(string? input, Guid? defaultValue = null)
    {
        if (string.IsNullOrEmpty(input)) return defaultValue;

        //sometimes request params have been duplicated. e.g. IconID=[id],[id]
        if (input.IndexOf(",") >= 0) input = input.Substring(0, input.IndexOf(","));

        Guid retVal = Guid.Empty;
        if (!Guid.TryParse(input, out retVal)) return defaultValue;
        return retVal;
    }
}
