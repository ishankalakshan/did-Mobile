angular.module('didApp.service', [])

.service('didAppDataService', ['$http', didAppDataService]);

function didAppDataService($http) {

    this.getTimeEntries = function () {
        return $http.get('http://localhost/didmobiledata/sp_Timeentries.json?callback=JSON_CALLBACK');
    };

    this.getProjects = function () {
        return $http.get('http://localhost/didmobiledata/sp_Projects.json');
    };
    
    this.getCustomers = function(){
        return $http.get('http://localhost/didmobiledata/sp_Customers.json');
    };
    

};