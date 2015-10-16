using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.SharePoint.Client;
using Pzl.Did.Api.Models;
using Pzl.SharePoint.Client;

namespace Pzl.Did.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProjectsController : ApiController
    {
        [Route("api/projects")]
        public List<ProjectModel> GetProjectsList()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();
                var credentialsFromToken = Token.GetCredentialsFromToken(token);

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

                var retrievedListItems = sharepointContext.RetrieveListItems(Query.Projects, List.Projects);
                var projectsList = retrievedListItems.Select(item => new ProjectModel(item)).ToList();

                return projectsList.Count == 0 ? null : projectsList;
            }
            catch (IdcrlException)
            {
                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
