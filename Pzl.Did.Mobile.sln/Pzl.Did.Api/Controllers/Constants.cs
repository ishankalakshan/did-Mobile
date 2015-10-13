﻿namespace Pzl.Did.Api.Controllers
{
    public class List
    {
        public const string TimeEntries = "TimeEntries";
        public const string Resources = "Resources";
        public const string Projects = "Projects";
        public const string Customers = "Customers";

    }

    public class Query
    {
        public const string ResourceId = @"<View> " +
                                         "<Query>" +
                                         "<Where><Eq><FieldRef Name='PzlEmail' />" +
                                         "<Value Type='Text'>{0}</Value></Eq></Where>" +
                                         "</Query> " +
                                         "<ViewFields><FieldRef Name='ID' /></ViewFields>" +
                                         "</View>";
        public const string TimeEntries = @"<View>" +
                                           "<Query>" +
                                           "<Where><Eq>" +
                                           "<FieldRef Name='PzlResourceKey' LookupId='True' />" +
                                           "<Value Type='Lookup'>{0}</Value></Eq></Where>" +
                                           "</Query>" +
                                           "<ViewFields><FieldRef Name='Title' />" +
                                           "<FieldRef Name='PzlStartTime' />" +
                                           "<FieldRef Name='PzlEndTime' />" +
                                           "<FieldRef Name='PzlDurationHours' />" +
                                           "<FieldRef Name='PzlTimeZone' />" +
                                           "<FieldRef Name='PzlDescription' />" +
                                           "<FieldRef Name='PzlState' />" +
                                           "<FieldRef Name='PzlCustomerKey' />" +
                                           "<FieldRef Name='PzlProjectKey' />" +
                                           "<FieldRef Name='PzlWeekNumber' />" +
                                           "<FieldRef Name='PzlYearNumber' />" +
                                           "<FieldRef Name='ID' /></ViewFields> " +
                                           "</View>";
        public const string Projects = @"<View>  
                                         <ViewFields><FieldRef Name='ID' />
                                         <FieldRef Name='PzlKey' />
                                         <FieldRef Name='Title' />
                                         <FieldRef Name='PzlCustomerKey' />
                                         </ViewFields> 
                                         </View>";
        public const string Customers = @"<View>  
                                          <ViewFields>
                                          <FieldRef Name='Title' />
                                          <FieldRef Name='PzlKey' />
                                          <FieldRef Name='ID' />
                                          </ViewFields> 
                                          </View>";  
    }

    public class Column
    {
        public const string PzlCustomerKey = "PzlCustomerKey";
        public const string PzlProjectKey = "PzlProjectKey";
        public const string PzlState = "PzlState";
    }

    public class State
    {
        public const string UserConfirmed = "UserConfirmed";
        public const string UserIgnored = "UserIgnored";
        public const string Approved = "Approved";
    }

}