using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.SharePoint.Client;
using Pzl.SharePoint.Client;
using Pzl.Did.Api.Models;

namespace Pzl.Did.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AuthenticationController : ApiController
    {
        [Route("api/authentication/{username}/{password}")]
        public List<ResourceModel> GetAuthenticationWithCredentials(string username, string password)
        {
            try
            {
                var url = ConfigurationManager.AppSettings["url"];
                var sc = new SharepointContext(url,username, password);
                var query = string.Format(Query.ResourceId, username);  

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

        [Route("api/authentication/{token}")] //VjvQy3TEYz3dfdc3FJ8mXZZL1pyn2RbWzQPzftm21Bs=
        public List<ResourceModel> GetAuthenticationWithToken(string token)
        {
            try
            {
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
