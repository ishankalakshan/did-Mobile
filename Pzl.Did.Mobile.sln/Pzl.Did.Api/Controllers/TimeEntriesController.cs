﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.SharePoint.Client;
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
        public bool PostAprroveTheWeek()
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

                sc.UpdateListItem(id, List.TimeEntries, "PzlCustomerKey", customerKeyId);
                sc.UpdateListItem(id, List.TimeEntries, "PzlProjectKey", projectKeyId);

                return true;
            }
            catch (Exception)
            {
                    
                throw;
            }
        }
    }
}
