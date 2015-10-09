using Microsoft.SharePoint.Client;

namespace Pzl.Did.Api.Models
{
    public class CustomerModel
    {
      public string Id { get; set; }
      public string Title { get; set; }
      public string Key { get; set; }

        public CustomerModel(ListItem item)
        {
            if (item["ID"] != null)
            {
                Id = item["ID"].ToString();
            }
            if (item["PzlKey"] != null)
            {
                Key = item["PzlKey"].ToString();
            }
            if (item["Title"] != null)
            {
                Title = item["Title"].ToString();
            }
        }
    }
}