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
        [Route("api/customers/{token}")]
        public List<CustomerModel> GetProjectsList(string token)
        {
            try
            {
                var cred = Token.GetCredentialsFromToken(token);
                var url = ConfigurationManager.AppSettings["url"];

                var sc = new SharepointContext(url, cred[0], cred[1]);
                var query = string.Format(Query.Customers);

                var list = sc.RetrieveListItem(query, List.Customers);
                var customerList = list.Select(item => new CustomerModel(item)).ToList();

                return customerList.Count == 0 ? null : customerList;
            }
            catch (IdcrlException)
            {

                return null;
            }
        }
    }
}
