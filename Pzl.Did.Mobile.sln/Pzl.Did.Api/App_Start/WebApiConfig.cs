using System.Net.Http.Headers;
using System.Web.Http;

namespace Pzl.Did.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.EnableCors();
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "AuthenticationApi",
                routeTemplate: "api/{controller}/{username}/{password}"
            );
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
        }
    }
}
