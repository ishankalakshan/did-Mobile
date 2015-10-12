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
    public class TimeEntriesController : ApiController
    {
        [Route("api/timeentries")]
        public List<TimeEntryModel> GetTimeEntriesList()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();
                var cred = Token.GetCredentialsFromToken(token);
                var url = ConfigurationManager.AppSettings["url"];

                var sc = new SharepointContext(url, cred[0], cred[1]);
                var query = string.Format(Query.TimeEntries, "20");

                var list = sc.RetrieveListItem(query, List.TimeEntries);
                var timeEntriesList = list.Select(item => new TimeEntryModel(item)).ToList();

                return timeEntriesList.Count == 0 ? null : timeEntriesList;
            }
            catch (IdcrlException)
            {

                return null;
            }
            catch (Exception)
            {
                return null ;
            }
        }
    }
}
