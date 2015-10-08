using System;
using Microsoft.SharePoint.Client;

namespace Pzl.Did.Api.Models
{
    public class ResourceModel
    {
        public ResourceModel(ListItem item)
        {
            try
            {
                if (!item["ID"].Equals(null))
                {
                    Id = item["ID"].ToString();
                } 
            }
            catch (Exception)
            {
                throw;
            } 
        }

        public string Id { get; set; }
    }
}