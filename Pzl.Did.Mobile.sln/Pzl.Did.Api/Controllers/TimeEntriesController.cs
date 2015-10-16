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
        [HttpPost]
        public List<TimeEntryModel> TimeEntriesList()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();
                var credentialsFromToken = Token.GetCredentialsFromToken(token);

                var streamReader = new StreamReader(HttpContext.Current.Request.InputStream);
                var retrivedPostData = streamReader.ReadToEnd();
                var jObject = JObject.Parse(retrivedPostData);
                var listOfWeeks = JArray.Parse(JsonConvert.SerializeObject(jObject["initialWeeks"]));

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

                foreach (var week in listOfWeeks)
                {
                    var query = string.Format(Query.TimeEntries, "20", (string)week["week"], (string)week["year"]);
                    var retrievedListItems = sharepointContext.RetrieveListItems(query, List.TimeEntries);
                    var timeEntriesList = retrievedListItems.Select(item => new TimeEntryModel(item)).ToList();

                    return timeEntriesList.Count == 0 ? null : timeEntriesList;
                }
                return null;
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

        [Route("api/timeentries/confirm")]
        [HttpPost]
        public bool PostConfirmEntry()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var credentialsFromToken = Token.GetCredentialsFromToken(token);
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

                var streamReader = new StreamReader(HttpContext.Current.Request.InputStream);
                var retrivedPostData = streamReader.ReadToEnd();
                var jObject = JObject.Parse(retrivedPostData);
                var entryId = (string)jObject["id"];
                var customerKeyId = (string)jObject["customerKeyId"];
                var projectKeyId = (string)jObject["projectKeyId"];

                var updateValuesDictionary = new Dictionary<string, object>
                {
                    {Column.CustomerKey, new FieldLookupValue { LookupId = Convert.ToInt32(customerKeyId) }},
                    {Column.ProjectKey, new FieldLookupValue { LookupId = Convert.ToInt32(projectKeyId) }},
                    {Column.State, State.UserConfirmed},
                };
                sharepointContext.UpdateListItem(entryId, List.TimeEntries, updateValuesDictionary);

                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void UpdateTimeEntryState(string state)
        {
            var headerValues = Request.Headers.GetValues("Authorization");
            var token = headerValues.FirstOrDefault();

            var siteUrl = ConfigurationManager.AppSettings["url"];
            var credentialsFromToken = Token.GetCredentialsFromToken(token);
            var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

            var streamReader = new StreamReader(HttpContext.Current.Request.InputStream);
            var retrivedPostData = streamReader.ReadToEnd();
            var jObject = JObject.Parse(retrivedPostData);
            var listItemId = (string)jObject["id"];

            sharepointContext.UpdateListItem(listItemId, List.TimeEntries,
                new Dictionary<string, object>() { { Column.State, state } });
        }

        [Route("api/timeentries/ignore")]
        [HttpPost]
        public bool PostIgnoreEntry()
        {
            try
            {
                UpdateTimeEntryState(State.UserIgnored);
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
                UpdateTimeEntryState(State.UserIgnored);
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

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var credentialsFromToken = Token.GetCredentialsFromToken(token);
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

                var streamReader = new StreamReader(HttpContext.Current.Request.InputStream);
                var retrivedPostData = streamReader.ReadToEnd();
                var jObject = JObject.Parse(retrivedPostData);
                var confirmed = jObject["confirmed"];
                var ignored = jObject["ignored"];

                var confirmedIds = JArray.Parse(JsonConvert.SerializeObject(confirmed));
                var ignoredIds = JArray.Parse(JsonConvert.SerializeObject(ignored));

                for (var j = 0; j < confirmedIds.Count; j++)
                {
                    var entry = confirmedIds[j];
                    var entryId = (string)entry["id"];
                    sharepointContext.UpdateListItem(entryId, List.TimeEntries, new Dictionary<string, object>() { { Column.State, State.Approved } });
                }

                for (var j = 0; j < ignoredIds.Count; j++)
                {
                    var entry = ignoredIds[j];
                    var entryId = (string)entry["id"];
                    sharepointContext.UpdateListItem(entryId, List.TimeEntries, new Dictionary<string, object>() { { Column.State, State.IgnoreApproved } });
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
