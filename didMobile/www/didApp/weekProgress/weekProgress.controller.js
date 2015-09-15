angular.module('didApp.weekProgressController', ['angularMoment'])

.controller('weekProgressCtrl',['$scope','$stateParams','didAppDataService',weekProgressCtrl])

function weekProgressCtrl($scope,$stateParams,didAppDataService){

  $scope.weekCount = $stateParams.currentWeekNumber*1;
  $scope.yearCount = $stateParams.currentYearNumber*1;
  console.log($scope.weekCount);
  ionic.Platform.ready(function(){
    $scope.timesheet = [];
    didAppDataService.loadData();
    $scope.weekStartend = getWeekStartEnd($scope.weekCount,$scope.yearCount);
    $scope.weeklyTimesheet = [];
    getAllWeekEntries($scope.weekCount,$scope.yearCount);
    setWeekTimeSheet($scope.weekCount,$scope.yearCount);
    console.log($scope.weekCount);

  });

  var allWeekTimeEntries = [];

  $scope.$on('didApp.didmobiledata',function(_,result){
    result.feed.entry.forEach(function(b){
      $scope.timesheet.push({
          id:b.content.properties.Id.__text,
          title:b.content.properties.Title.__text,
          startTime:b.content.properties.PzlStartTime.__text,
          endTime:b.content.properties.PzlEndTime.__text,
          duration:b.content.properties.PzlDurationHours.__text,

          timezone:b.content.properties.PzlTimeZone.__text,
          description:b.content.properties.PzlDescription.__text,
          state:b.content.properties.PzlState.__text,
          category:b.content.properties.PzlCategory.__text,
          location:b.content.properties.PzlLocation.__text,

          organizer:b.content.properties.PzlOrganizer.__text,
          customerKeyId:b.content.properties.PzlCustomerKeyId.__text,
          resourceKeyId:b.content.properties.PzlResourceKeyId.__text,
          dateImported:b.content.properties.PzlDateImported.__text,
          lastUpdatedOn:b.content.properties.PzlLastUpdatedOn.__text,

          sourceSystemId:b.content.properties.PzlSourceSystemId.__text,
          weekNumber:b.content.properties.PzlWeekNumber.__text,
          yearNumber:b.content.properties.PzlYearNumber.__text,
          modified:b.content.properties.Modified.__text,
          created:b.content.properties.Created.__text
      });
    });
  });


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
    console.log(allWeekTimeEntries);
    return allWeekTimeEntries;
  };

  function getTotalHoursPerDay(date){
    var totalHours = 0;
    allWeekTimeEntries.forEach(function(day){
      if (moment(day.startTime).format('MMM, dddd DD') == date) {
        totalHours +=day.duration*1
      }
    });//end foreach
    return totalHours;
  };//end of getTotalHoursPerDay

  function getStateOfDay(date){
    var suggestCount= 0;
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
  };//end of getStateOfDay

  function getStateOfWeek(){
    var suggestedCount =0;
    var approvedCount = 0;

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
  };

  function setWeekTimeSheet(weekNumber,yearNumber){
    for (var i = 1; i < 6; i++) {
      var weekStartDate = moment(String(weekNumber)+ yearNumber,'WWYYYY').startOf('isoWeek').day(i).format('MMM, dddd DD')
          $scope.weeklyTimesheet.push({
            date : moment(weekStartDate,'MMM, dddd DD').format('ddd'),
            hours : getTotalHoursPerDay(weekStartDate),
            state : getStateOfDay(weekStartDate)
          });
    };//end for

  };

  $scope.addOneWeek =function(){
    $scope.weekCount += 1;
    console.log($scope.weekCount);
    $scope.weeklyTimesheet = [];
    $scope.weekStartend = getWeekStartEnd($scope.weekCount,$scope.yearCount);
    getAllWeekEntries($scope.weekCount,$scope.yearCount);
    setWeekTimeSheet($scope.weekCount,$scope.yearCount);
    $scope.stateWeek =getStateOfWeek();
  };//end of addOneWeek()

  $scope.substractOneWeek =function(){
    $scope.weekCount -= 1;
    console.log($scope.weekCount);
    $scope.weeklyTimesheet = [];
    $scope.weekStartend = getWeekStartEnd($scope.weekCount,$scope.yearCount);
    getAllWeekEntries($scope.weekCount,$scope.yearCount);
    setWeekTimeSheet($scope.weekCount,$scope.yearCount);
    $scope.stateWeek =getStateOfWeek();
  };//end of substractOneWeek()

  $scope.onLoad = function(){

    getAllWeekEntries('37','2015');
    setWeekTimeSheet('37','2015');
  };


};//end of weekProgressCtrl
