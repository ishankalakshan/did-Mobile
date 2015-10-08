angular.module('didApp.service', [])

.service('didAppDataService', ['$http', didAppDataService]);

function didAppDataService($http) {
    
    var authenticationUri = 'http://localhost.fiddler:55614/api/authentication';

    this.getTimeEntries = function () {
        return $http.get('http://localhost/didmobiledata/sp_Timeentries.json?callback=JSON_CALLBACK');
    };

    this.getProjects = function () {
        return $http.get('http://localhost/didmobiledata/sp_Projects.json');
    };
    
    this.getCustomers = function(){
        return $http.get('http://localhost/didmobiledata/sp_Customers.json');
    };
    
//    this.getWebAPI = function(){
//        return $http.get(authenticationUri);
//    };
    

};