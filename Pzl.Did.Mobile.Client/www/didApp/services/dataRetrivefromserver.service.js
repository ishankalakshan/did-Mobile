angular.module('didApp.service', [])

.service('didAppDataService', ['$http', didAppDataService]);

function didAppDataService($http) {

  var TimeEntriesUri = 'http://localhost:52882/api/TimeEntries';
  var ProjectsUri = 'http://localhost:52882/api/Projects';
  var CustomersUri = 'http://localhost:52882/api/Customers';
  var uriExpressImport = 'http://localhost:52882/api/expressimport';

  this.getTimeEntries = function(startTime, endTime) {
    var Indata = {
      startTime: startTime,
      endTime: endTime
    }
    return $http({
      method: 'POST',
      url: TimeEntriesUri,
      data: JSON.stringify(Indata)
    })
  }

  this.getProjects = function() {
    return $http.get(ProjectsUri);
  };

  this.getCustomers = function() {
    return $http.get(CustomersUri);
  };

  this.getExpressImportStatus = function(resourceId) {
    var Indata = {
      resourceId: resourceId
    }
    return $http({
      method: 'POST',
      url: uriExpressImport,
      data: JSON.stringify(Indata)
    })
  }
};
