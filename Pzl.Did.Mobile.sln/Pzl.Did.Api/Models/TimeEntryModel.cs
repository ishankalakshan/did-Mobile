using System;
using Microsoft.SharePoint.Client;

namespace Pzl.Did.Api.Models
{
    public class TimeEntryModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Duration { get; set; }
        public string Timezone { get; set; }
        public string Description { get; set; }
        public string State { get; set; }
        public string CustomerKeyId { get; set; }
        public string CustomerKey { get; set; }
        public string ProjectKeyId { get; set; }
        public string ProjectKey { get; set; }
        public string ResourceKeyId { get; set; }
        public string WeekNumber { get; set; }
        public string YearNumber { get; set; }

        public TimeEntryModel(ListItem item)
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
                if (item["PzlStartTime"] != null)
                {
                    StartTime = item["PzlStartTime"].ToString();
                }
                if (item["PzlEndTime"] != null)
                {
                    EndTime = item["PzlEndTime"].ToString();
                }
                if (item["PzlDurationHours"] != null)
                {
                    Duration = item["PzlDurationHours"].ToString();
                }
                if (item["PzlTimeZone"] != null)
                {
                    Timezone = item["PzlTimeZone"].ToString();
                }
                if (item["PzlDescription"] != null)
                {
                   Description = item["PzlDescription"].ToString();
                }
                if (item["PzlState"] != null)
                {
                    State = item["PzlState"].ToString();
                }

                var customer = item["PzlCustomerKey"] as FieldLookupValue;
                if (customer != null)
                {
                    CustomerKeyId = customer.LookupId.ToString();
                    CustomerKey = customer.LookupValue; 
                }
                
                var project = item["PzlProjectKey"] as FieldLookupValue;
                if (project != null)
                {
                    ProjectKeyId = project.LookupId.ToString();
                    ProjectKey = project.LookupValue;
                }

                if (item["PzlWeekNumber"] !=null)
                {
                    WeekNumber = item["PzlWeekNumber"].ToString();
                }
                if (item["PzlYearNumber"] !=null)
                {
                    YearNumber = item["PzlYearNumber"].ToString();
                }
            }
            catch (Exception)
            {
                throw;
            } 
        }
    }
}