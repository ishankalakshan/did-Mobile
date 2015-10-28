using System;
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

namespace Pzl.Did.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ExpressImportController : ApiController
    {
        [Route("api/expressimport/addexpressimport")]
        [HttpPost]
        public bool AddExpressImportEntry()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();
                var credentialsFromToken = Token.GetCredentialsFromToken(token);

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

                var streamReader = new StreamReader(HttpContext.Current.Request.InputStream);
                var retrievedPostData = streamReader.ReadToEnd();
                var jObject = JObject.Parse(retrievedPostData);
                var resourceId = (int)jObject["resourceId"];
                var startDate = (DateTime)jObject["startDate"];
                var endDate = (DateTime)jObject["endDate"];

                var addValuesDictionary = new Dictionary<string, object>
                {
                    {Column.ResourceKey, new FieldLookupValue { LookupId = resourceId }},
                    {Column.ImportFromDate,startDate },
                    {Column.ImportToDate,endDate}
                };

                sharepointContext.AddListItem(List.ExpressImports, addValuesDictionary);

                return true;

            }
            catch (IdcrlException)
            {
                return false;
            }
        }

        [Route("api/expressimport")]
        [HttpPost]
        public bool RetrieveExpressImportStatus()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();
                var credentialsFromToken = Token.GetCredentialsFromToken(token);

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

                var streamReader = new StreamReader(HttpContext.Current.Request.InputStream);
                var retrievedPostData = streamReader.ReadToEnd();
                var jObject = JObject.Parse(retrievedPostData);
                var resourceId = (string)jObject["resourceId"];

                var query = string.Format(Query.ExpressImport, resourceId);
                var retrievedListItems = sharepointContext.RetrieveListItems(query, List.ExpressImports);

                return retrievedListItems.ToList().Count != 0;
            }
            catch (Exception)
            {
                return false;
                throw;
            }
        }
    }
}
