using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.SharePoint.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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

        [Route("api/timeentries")]
        [HttpPost]
        public bool PostConfirmEntry()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();

                var url = ConfigurationManager.AppSettings["url"];
                var cred = Token.GetCredentialsFromToken(token);
                var sc = new SharepointContext(url, cred[0], cred[1]);

                var oSr = new StreamReader(HttpContext.Current.Request.InputStream);
                var sContent = oSr.ReadToEnd();
                var obj = JObject.Parse(sContent);
                var id = (string)obj["id"];
                var customerKeyId = (string)obj["customerKeyId"];
                var projectKeyId = (string)obj["projectKeyId"];

                sc.UpdateListItemWithLookUp(id, List.TimeEntries, Column.PzlCustomerKey, customerKeyId);
                sc.UpdateListItemWithLookUp(id, List.TimeEntries, Column.PzlProjectKey, projectKeyId);
                sc.UpdateListItem(id, List.TimeEntries, Column.PzlState, State.UserConfirmed);

                return true;
            }
            catch (Exception)
            {
                    
                throw;
            }
        }

        [Route("api/timeentries/ignore")]
        [HttpPost]
        public bool PostIgnoreEntry()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();

                var url = ConfigurationManager.AppSettings["url"];
                var cred = Token.GetCredentialsFromToken(token);
                var sc = new SharepointContext(url, cred[0], cred[1]);

                var oSr = new StreamReader(HttpContext.Current.Request.InputStream);
                var sContent = oSr.ReadToEnd();
                var obj = JObject.Parse(sContent);
                var id = (string)obj["id"];

                sc.UpdateListItem(id, List.TimeEntries, Column.PzlState, State.UserIgnored);
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [Route("api/timeentries/private")]
        [HttpPost]
        public bool PostPrivateEntry()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();

                var url = ConfigurationManager.AppSettings["url"];
                var cred = Token.GetCredentialsFromToken(token);
                var sc = new SharepointContext(url, cred[0], cred[1]);

                var oSr = new StreamReader(HttpContext.Current.Request.InputStream);
                var sContent = oSr.ReadToEnd();
                var obj = JObject.Parse(sContent);
                var id = (string)obj["id"];

                sc.UpdateListItem(id, List.TimeEntries, Column.PzlState, State.UserIgnored);
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }

        [Route("api/timeentries/approve")]
        [HttpPost]
        public bool PostApproveWeek()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();

                var url = ConfigurationManager.AppSettings["url"];
                var cred = Token.GetCredentialsFromToken(token);
                var sc = new SharepointContext(url, cred[0], cred[1]);

                var oSr = new StreamReader(HttpContext.Current.Request.InputStream);
                var sContent = oSr.ReadToEnd();
                var obj = JObject.Parse(sContent);
                var confirmed = obj["confirmed"];
                var ignored = obj["ignored"];

                var con = JsonConvert.SerializeObject(confirmed);
                var ig = JsonConvert.SerializeObject(ignored);

                var confirmedIds = JArray.Parse(con);
                var ignoredIds = JArray.Parse(ig);

                for (var j = 0; j < confirmedIds.Count; j++)
                {
                    var entry = confirmedIds[j];
                    var id = (string)entry["id"];
                    sc.UpdateListItem(id, List.TimeEntries, Column.PzlState, State.Approved);
                }

                for (var j = 0; j < ignoredIds.Count; j++)
                {
                    var entry = ignoredIds[j];
                    var id = (string)entry["id"];
                    sc.UpdateListItem(id, List.TimeEntries, Column.PzlState, State.IgnoreApproved);
                }
                


                
                
                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
