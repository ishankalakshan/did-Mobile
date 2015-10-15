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
                var oSr = new StreamReader(HttpContext.Current.Request.InputStream);
                var sContent = oSr.ReadToEnd();
                var obj = JObject.Parse(sContent);
                var username = Token.DecryptStringAes((string)obj["username"]);
                var password = Token.DecryptStringAes((string)obj["password"]);
 
                var url = ConfigurationManager.AppSettings["url"];
                var sc = new SharepointContext(url,username, password);
                var query = string.Format(Query.ResourceId, username);  

                var list = sc.RetrieveListItem(query, List.Resources);
                var idList = list.Select(item => new ResourceModel(item)).ToList();

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

                var url = ConfigurationManager.AppSettings["url"];
                var cred = Token.GetCredentialsFromToken(token);
                var sc = new SharepointContext(url,cred[0], cred[1]);
                var query = string.Format(Query.ResourceId, cred[0]);  

                const string listTitle = List.Resources;

                var list = sc.RetrieveListItem(query, listTitle);
                var idList = list.Select(item => new ResourceModel(item)).ToList();

                return idList.Count == 0 ? null : idList;
            }
            catch (IdcrlException)
            {

                return null;
            }
            
        }
    }
}
