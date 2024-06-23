using LibraryWebApis;
using LibraryWebApis.Database.Collections;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var appSettings = new AppSettings(builder.Configuration);

// Add services to the container.

builder.Services.AddCors();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(appSettings.JWT.Secret)
        ),
        ValidIssuer = appSettings.JWT.Issuer,
        ValidAudience = appSettings.JWT.Issuer,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers(options => options.Conventions.Add(new KebabCaseControllerModelConvention()));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options => SwaggerGenConfig.AddOptions(options));

builder.Services.AddSingleton(appSettings);
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<CurrentUser>();
builder.Services.AddScoped<ControllerHelpers>();

// MongoDB Dependencies
builder.Services.AddSingleton<IMongoClient>((sp) => 
    new MongoClient($"{appSettings.MongoDB.ConnectionString}/{appSettings.MongoDB.DatabaseName}")
);
builder.Services.AddSingleton<MongoDBContext>();
builder.Services.AddScoped<BooksCollection>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.UseCors();

app.MapControllers();

app.Run();
