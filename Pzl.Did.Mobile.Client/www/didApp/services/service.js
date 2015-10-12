angular.module('didApp.service', [])

.service('didAppDataService', ['$http', didAppDataService]);

function didAppDataService($http) {
    
    var TimeEntriesUri = 'http://localhost:52882/api/TimeEntries';
    var ProjectsUri = 'http://localhost:52882/api/Projects';
    var CustomersUri = 'http://localhost:52882/api/Customers';

    this.getTimeEntries = function () {
        return $http.get(TimeEntriesUri);
    };

    this.getProjects = function () {
        return $http.get(ProjectsUri);
    };
    
    this.getCustomers = function(){
        return $http.get(CustomersUri);
    };
        
};