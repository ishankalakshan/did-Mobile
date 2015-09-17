angular.module('didApp.projectProgressController', ['angularMoment'])

.controller('projectProgressCtrl',['$scope','$stateParams','didAppDataStoreService',projectProgressCtrl])

function projectProgressCtrl($scope,$stateParams,didAppDataStoreService){

  $scope.id = $stateParams.selectedId;
  $scope.timesheet = didAppDataStoreService.getlocalStorageTimesheet();
  $scope.project = {};

  (function() {
    $scope.timesheet.forEach(function(result){
      if (result.id==$scope.id) {
        $scope.project.startTime = moment(result.startTime).format('hh:mm A')
        $scope.project.endTime = moment(result.endTime).format('hh:mm A')
        $scope.project.duration = result.duration
        $scope.project.customerKeyId = result.customerKeyId
        $scope.project.projectKeyId = result.projectKeyId
        $scope.project.state = result.state
      }
    })
  })();

  $scope.getDuration = function(start,end){
    return moment.utc(moment(end,"hh:mm A").diff(moment(start,"hh:mm A"))).format("HH:mm")
  };
  
};
