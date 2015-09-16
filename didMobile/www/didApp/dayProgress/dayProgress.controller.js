angular.module('didApp.dayProgressController', ['angularMoment'])

.controller('dayProgressCtrl',['$scope','$stateParams','didAppDataService',dayprogressCtrl])

function dayprogressCtrl($scope,$stateParams,didAppDataService){

  $scope.date = $stateParams.selectedDate;
  $scope.timesheet = [];
  var allDayTimeEntries = [];
  $scope.dayTimeSheet = [];

  function initialize(){
    didAppDataService.loadData($scope)
    console.log($scope.timesheet);
  }

  initialize();

  $scope.refreshData = function () {
    setDayTimeSheet($scope.date);
    console.log($scope.dayTimeSheet);
  }

  function getAllDayEntries(date){
    allDayTimeEntries = [];
    $scope.timesheet.forEach(function(entry){
      if (moment(entry.startTime).format('MMM, dddd DD')==date) {
            allDayTimeEntries.push(entry);
      }//end if
    });//end forEach
    $scope.$broadcast('scroll.refreshComplete');
    return allDayTimeEntries;
  };

  function setDayTimeSheet(date){
    getAllDayEntries(date).forEach(function(entry){
      $scope.dayTimeSheet.push({
        title : entry.title,
        state : entry.state
      });
    });
  };



};
