using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.SharePoint.Client;
using Newtonsoft.Json.Linq;
using Pzl.SharePoint.Client;
using Pzl.Did.Api.Models;

namespace Pzl.Did.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AuthenticationController : ApiController
    {
        [Route("api/authentication")]
        [HttpPost]
        public List<ResourceModel> AuthenticationWithCredentials()
        {
            try
            {
                var streamReader = new StreamReader(HttpContext.Current.Request.InputStream);
                var retrievedPostData = streamReader.ReadToEnd();
                var jObject = JObject.Parse(retrievedPostData);
                var username = Token.DecryptStringAes((string)jObject["username"]);
                var password = Token.DecryptStringAes((string)jObject["password"]);

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var sharepointContext = new SharepointContext(siteUrl, username, password);
                var query = string.Format(Query.ResourceId, username);

                var retrievedListItems = sharepointContext.RetrieveListItems(query, List.Resources);
                var idList = retrievedListItems.Select(item => new ResourceModel(item)).ToList();

                return idList.Count == 0 ? null : idList;
            }
            catch (IdcrlException)
            {
                return null;
            }
        }

        [Route("api/authentication")]
        public List<ResourceModel> GetAuthenticationWithToken()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var credentialsFromToken = Token.GetCredentialsFromToken(token);
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);
                var query = string.Format(Query.ResourceId, credentialsFromToken[0]);

                const string listTitle = List.Resources;

                var retrievedListItems = sharepointContext.RetrieveListItems(query, listTitle);
                var idList = retrievedListItems.Select(item => new ResourceModel(item)).ToList();

                return idList.Count == 0 ? null : idList;
            }
            catch (IdcrlException)
            {
                return null;
            }
        }
    }
}
