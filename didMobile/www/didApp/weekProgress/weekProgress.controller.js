angular.module('didApp.weekProgressController', ['angularMoment'])

.controller('weekProgressCtrl',['$scope','$stateParams','$ionicLoading','didAppDataService',weekProgressCtrl])

function weekProgressCtrl($scope,$stateParams,$ionicLoading,didAppDataService){

  (function() {
    //$scope.refreshData();
  })();

  $scope.timesheet = [];
  didAppDataService.loadData($scope)

  $scope.weekCount = moment().format('WW')*1;
  $scope.yearCount = moment().format('YYYY')*1;
  $scope.weekStartend = getWeekStartEnd($scope.weekCount,$scope.yearCount);
  $scope.weeklyTimesheet = [];
  getAllWeekEntries($scope.weekCount,$scope.yearCount);
  setWeekTimeSheet($scope.weekCount,$scope.yearCount);

  var allWeekTimeEntries = [];

  $scope.refreshData = function(){
    //$scope.timesheet = [];
    allWeekTimeEntries = [];
    $scope.weekCount = moment().format('WW')*1;
    $scope.yearCount = moment().format('YYYY')*1;
    $scope.weeklyTimesheet = [];
    //didAppDataService.loadData($scope)
    getAllWeekEntries($scope.weekCount,$scope.yearCount);
    setWeekTimeSheet($scope.weekCount,$scope.yearCount);
  };

  function getWeekStartEnd(weekNumber,yearNumber){
      var weekStartEnd = {
        weekNumber : weekNumber,
        weekStart : moment(String(weekNumber)+ yearNumber,'WWYYYY').startOf('isoWeek').format('MMM, dddd DD'),
        weekEnd : moment(String(weekNumber)+yearNumber,'WWYYYY').endOf('isoWeek').day(-2).format('MMM, dddd DD')
      };
    return weekStartEnd;
  };//end of getWeekStartEnd()


  function getAllWeekEntries(weekNumber,yearNumber){
    allWeekTimeEntries = [];
    $scope.weekStartend = getWeekStartEnd(weekNumber,yearNumber);
    $scope.timesheet.forEach(function(entry){
      if (entry.weekNumber==weekNumber && entry.yearNumber==yearNumber) {
            allWeekTimeEntries.push(entry);
      }//end if
    });//end forEach
    $scope.$broadcast('scroll.refreshComplete');
    return allWeekTimeEntries;
  };

  function getTotalHoursPerDay(date){
    var totalHours = 0;

    if (allWeekTimeEntries.length==0) {
      return '-';
    }else {
      allWeekTimeEntries.forEach(function(day){
        if (moment(day.startTime).format('MMM, dddd DD') == date) {
          totalHours +=day.duration*1
        }
      });//end foreach
      return totalHours;
    }
  };//end of getTotalHoursPerDay

  function getStateOfDay(date){
    var suggestCount= 0;
    if (allWeekTimeEntries.length!==0) {
      allWeekTimeEntries.forEach(function(day){
        if (moment(day.startTime).format('MMM, dddd DD') == date && day.state =='Suggested') {
          suggestCount +=1
        }
      });//end foreach
      if (suggestCount>0) {
        return false;
      }else {
        return true;
      }
    }else {
      true
    }


  };//end of getStateOfDay

  function getStateOfWeek(){
    var suggestedCount =0;
    var approvedCount = 0;

    if (allWeekTimeEntries.length!==0) {
      allWeekTimeEntries.forEach(function(day){
        if (day.state =='Suggested') {
          suggestedCount +=1
        }
        if (day.state =='Approved') {
          approvedCount +=1
        }
      });//end foreach
      if (approvedCount > 0) {
        console.log('Display already confirmed');
        return 'Confirmed';
      }else if (suggestedCount >0 ) {
        console.log('dont display button');
        return 'Suggested';
      }else if (suggestedCount==0 && approvedCount ==0) {
        console.log('Display this is what i DId button');
        return 'DidIt';
      }
    }else {
        return 'Suggested';
    }
  };

  function setWeekTimeSheet(weekNumber,yearNumber){
    for (var i = 1; i < 6; i++) {
      var weekStartDate = moment(String(weekNumber)+ yearNumber,'WWYYYY').startOf('isoWeek').day(i).format('MMM, dddd DD')
          $scope.weeklyTimesheet.push({
            date    : moment(weekStartDate,'MMM, dddd DD').format('ddd'),
            dateFull: weekStartDate,
            hours   : getTotalHoursPerDay(weekStartDate),
            state   : getStateOfDay(weekStartDate)
          });
    };//end for
  };

  $scope.addOneWeek =function(){
    if (moment().format('WW')>=$scope.weekCount) {
      $scope.weekCount += 1;
      console.log($scope.weekCount);
      $scope.weeklyTimesheet = [];
      $scope.weekStartend = getWeekStartEnd($scope.weekCount,$scope.yearCount);
      getAllWeekEntries($scope.weekCount,$scope.yearCount);
      setWeekTimeSheet($scope.weekCount,$scope.yearCount);
      $scope.stateWeek =getStateOfWeek();
    }
  };//end of addOneWeek()

  $scope.substractOneWeek =function(){
    if ($scope.weekCount>=2) {
      $scope.weekCount -= 1;
      console.log($scope.weekCount);
      $scope.weeklyTimesheet = [];
      $scope.weekStartend = getWeekStartEnd($scope.weekCount,$scope.yearCount);
      getAllWeekEntries($scope.weekCount,$scope.yearCount);
      setWeekTimeSheet($scope.weekCount,$scope.yearCount);
      $scope.stateWeek =getStateOfWeek();
    }
  };//end of substractOneWeek()

  $scope.onLoad = function(){

    getAllWeekEntries('37','2015');
    setWeekTimeSheet('37','2015');
  };



};//end of weekProgressCtrl
