public class _JwtSettings
{
    public string Secret { get; set; }
    public string Issuer { get; set; }

    public _JwtSettings(IConfiguration config)
    {
        Secret = config["JWT:Secret"] ?? "";
        Issuer = config["JWT:Issuer"] ?? "";
    }
}

public class _MongoDB {
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }

    public _MongoDB(IConfiguration config)
    {
        ConnectionString = config["MongoDB:ConnectionString"] ?? "";
        DatabaseName = config["MongoDB:DatabaseName"] ?? "";
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
