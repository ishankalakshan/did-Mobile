angular.module('didApp.service', [])

.service('didAppDataService', ['$http', didAppDataService]);

function didAppDataService($http) {
    
    var TimeEntriesUri = 'http://localhost:52882/api/TimeEntries';
    var ProjectsUri = 'http://localhost:52882/api/Projects';
    var CustomersUri = 'http://localhost:52882/api/Customers';

    /*this.getTimeEntries = function (weekNumber,yearNumber) {
        return $http.get(TimeEntriesUri+'/'+weekNumber+'/'+yearNumber);
    };
    */
    this.getTimeEntries = function(startTime, endTime){
        var Indata = {startTime:startTime, endTime:endTime}
        return $http({
                  method  : 'POST',
                  url     : TimeEntriesUri,
                  data    : JSON.stringify(Indata)
                 })
    }  

    this.getProjects = function () {
        return $http.get(ProjectsUri);
    };
    
    this.getCustomers = function(){
        return $http.get(CustomersUri);
    };
        
};