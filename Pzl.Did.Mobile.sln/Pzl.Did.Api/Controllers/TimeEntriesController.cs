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
    public class TimeEntriesController : ApiController
    {
        [Route("api/timeentries/{token}")]
        public List<TimeEntryModel> GetAuthenticationWithToken(string token)
        {
            try
            {
                var cred = Token.GetCredentialsFromToken(token);
                var url = ConfigurationManager.AppSettings["url"];

                var sc = new SharepointContext(url,cred[0], cred[1]);
                var query = string.Format(Query.TimeEntries,"20");

                const string listTitle = List.TimeEntries;

                var list = sc.RetrieveListItem(query, listTitle);
                var timeEntriesList = list.Select(item => new TimeEntryModel(item)).ToList();

                return timeEntriesList.Count == 0 ? null : timeEntriesList;
            }
            catch (IdcrlException)
            {

                return null;
            }
        }
    }
}
