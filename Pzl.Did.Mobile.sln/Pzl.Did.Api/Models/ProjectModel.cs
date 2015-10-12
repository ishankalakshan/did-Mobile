using System;
using Microsoft.SharePoint.Client;

namespace Pzl.Did.Api.Models
{
    public class ProjectModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Key { get; set; }
        public string CustomerKeyId { get; set; }
        public string CustomerKey { get; set; }

        public ProjectModel(ListItem item)
        {
            try
            {
                if (item["ID"] != null)
                {
                    Id = item["ID"].ToString();
                }
                if (item["Title"] != null)
                {
                    Title = item["Title"].ToString();
                }
                if (item["PzlKey"] != null)
                {
                    Key = item["PzlKey"].ToString();
                }

                var customer = item["PzlCustomerKey"] as FieldLookupValue;
                if (customer != null)
                {
                    CustomerKeyId = customer.LookupId.ToString();
                    CustomerKey = customer.LookupValue.ToString();
                }
                
            }
            catch (Exception)
            {
                    
                throw;
            }
        }
    }
}