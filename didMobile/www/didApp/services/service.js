angular.module('didApp.service', [])

.service('didAppDataService',['$http','$rootScope',didAppDataService]);

function didAppDataService($http,$rootScope){
  this.loadData = function(){
    $http.get('http://localhost/didmobiledata/sp_Timeentries.json')
      .success(function(result){
        $rootScope.$broadcast('didApp.didmobiledata',result);
      });
  };
};
