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
                var cred = Token.GetCredentialsFromToken(token);
                var url = ConfigurationManager.AppSettings["url"];

                var sc = new SharepointContext(url, cred[0], cred[1]);
                var query = string.Format(Query.Projects);

                var list = sc.RetrieveListItem(query, List.Projects);
                var projectsList = list.Select(item => new ProjectModel(item)).ToList();

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
