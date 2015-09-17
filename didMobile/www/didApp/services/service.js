angular.module('didApp.service', [])

.service('didAppDataService',['$http','$rootScope',didAppDataService]);

function didAppDataService($http){
  this.loadData = function(){
    return $http.get('http://localhost/didmobiledata/sp_Timeentries.json?callback=JSON_CALLBACK');
  };
};
