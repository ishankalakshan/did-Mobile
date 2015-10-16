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
    public class CustomersController : ApiController
    {
        [Route("api/customers")]
        public List<CustomerModel> GetProjectsList()
        {
            try
            {
                var headerValues = Request.Headers.GetValues("Authorization");
                var token = headerValues.FirstOrDefault();
                var credentialsFromToken = Token.GetCredentialsFromToken(token);

                var siteUrl = ConfigurationManager.AppSettings["url"];
                var sharepointContext = new SharepointContext(siteUrl, credentialsFromToken[0], credentialsFromToken[1]);

                var retrievedListItems = sharepointContext.RetrieveListItems(Query.Customers, List.Customers);
                var customerList = retrievedListItems.Select(item => new CustomerModel(item)).ToList();

                return customerList.Count == 0 ? null : customerList;
            }
            catch (IdcrlException)
            {
                return null;
            }
            catch (InvalidOperationException)
            {
                return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
