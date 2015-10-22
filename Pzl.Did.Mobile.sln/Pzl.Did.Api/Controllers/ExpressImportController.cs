using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.SharePoint.Client;

namespace Pzl.Did.Api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ExpressImportController : ApiController
    {
        [Route("api/expressimport")]
        [HttpPost]
        public bool AddExpressImportEntry()
        {
            try
            {
                
            }
            catch (IdcrlException)
            {
                return false;
            }
            return false;
        }
    }
}
