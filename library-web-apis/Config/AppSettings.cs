public class _SettingsUtil {
    public static string GetValue(IConfiguration config, string key)
    {
        string? value = config.GetValue<string>(key);
        return (string.IsNullOrEmpty(value) ? config[key] : value) ?? "";
    }
}

public class _JwtSettings
{
    public string Secret { get; set; }
    public string Issuer { get; set; }

    public _JwtSettings(IConfiguration config)
    {
        Secret = _SettingsUtil.GetValue(config, "JWT:Secret");
        Issuer = _SettingsUtil.GetValue(config, "JWT:Issuer");
    }
}

public class _MongoDB {
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }

    public _MongoDB(IConfiguration config)
    {
        ConnectionString = _SettingsUtil.GetValue(config, "MongoDB:ConnectionString");
        DatabaseName = _SettingsUtil.GetValue(config, "MongoDB:DatabaseName");
    }
}

public class AppSettings
{
    public readonly _JwtSettings JWT;
    public readonly _MongoDB MongoDB;

    public AppSettings(IConfiguration config)
    {
        JWT = new _JwtSettings(config);
        MongoDB = new _MongoDB(config);
    }
}
