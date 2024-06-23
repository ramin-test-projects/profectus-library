using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.Text.RegularExpressions;

public class KebabCaseControllerModelConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        controller.ControllerName = ToKebabCase(controller.ControllerName);
    }

    private string ToKebabCase(string str)
    {
        return string.IsNullOrEmpty(str) ? str : Regex.Replace(str, "(?<!^)([A-Z])", "-$1").ToLower();
    }
}