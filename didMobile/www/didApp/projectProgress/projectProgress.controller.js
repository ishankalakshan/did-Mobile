angular.module('didApp.projectProgressController', ['angularMoment'])

.controller('projectProgressCtrl',['$scope','$stateParams','didAppDataStoreService',projectProgressCtrl])

function projectProgressCtrl($scope,$stateParams,didAppDataStoreService){

  $scope.id = $stateParams.selectedId;
  $scope.timesheet = didAppDataStoreService.getlocalStorageTimesheet();

  $scope.entry = [];

  $scope.timesheet.forEach(function(result) {
    if (result.id==$scope.id) {
      $scope.entry[0] = result;
      return $scope.entry;
    }
  })

  console.log($scope.entry);


};
