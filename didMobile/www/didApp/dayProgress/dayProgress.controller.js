angular.module('didApp.dayProgressController', ['angularMoment'])

.controller('dayProgressCtrl',['$scope','$stateParams','$q','didAppDataService','didAppDataStoreService',dayprogressCtrl])

function dayprogressCtrl($scope,$stateParams,$q,didAppDataService,didAppDataStoreService){

  $scope.date = $stateParams.selectedDate;
  $scope.timesheet = didAppDataStoreService.getlocalStorageTimesheet();
  $scope.dayTimeSheet = [];

  function initialize(){
    setDayTimeSheet($scope.date);
  }

  initialize();

  $scope.refreshData = function () {
    $scope.dayTimeSheet = [];
    setDayTimeSheet($scope.date);
  }

  function setDayTimeSheet(date){
    $scope.timesheet.forEach(function(entry){
      if (moment(entry.startTime).format('MMM, dddd DD')==date) {
            $scope.dayTimeSheet.push(entry);
      }//end if
    });//end forEach
    $scope.$broadcast('scroll.refreshComplete');
  };

};
