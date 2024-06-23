using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class SwaggerGenConfig
{
    public static void AddOptions(SwaggerGenOptions options)
    {
        options.OperationFilter<OptionalRouteParameterOperationFilter>();

        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
        {
            In = ParameterLocation.Header,
            Description = "Please enter your auth token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme()
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
    }
}

public class OptionalRouteParameterOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.Parameters == null)
            return;

        foreach (var parameter in operation.Parameters)
        {
            var apiParameterDescription = context.ApiDescription.ParameterDescriptions
                .First(p => p.Name == parameter.Name);

            // Check if the parameter is optional in the route
            if (apiParameterDescription.RouteInfo != null && apiParameterDescription.RouteInfo.IsOptional)
            {
                parameter.AllowEmptyValue = true;
                parameter.Required = false;
                parameter.Schema.Nullable = true;
            }
        }
    }
}
