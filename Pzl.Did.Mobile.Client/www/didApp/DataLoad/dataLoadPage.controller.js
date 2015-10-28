angular.module('didApp.dataLoadController', ['angularMoment'])

.controller('dataLoadCtrl', ['$scope','$rootScope','$state','$stateParams','$ionicLoading','didAppDataService','didAppDataStoreService','didAppDataLoadService',dataLoadCtrl])

function dataLoadCtrl($scope,$rootScope,$state,$stateParams,$ionicLoading,didAppDataService,didAppDataStoreService,didAppDataLoadService){

  var resourceId = $stateParams.resourceId;
  var year = moment().format('YYYY') * 1;
  var  week= moment().format('WW') * 1;

  (function () {
      didAppDataLoadService.requestProjects();
      didAppDataLoadService.requestCustomers();
      didAppDataLoadService.requestExpressImportStatus(resourceId);

      var range = getInitialWeekRange(week, year);
      didAppDataLoadService.requestTimesheet(range[0], range[1])
      .then(function(){
          $state.go('weekProgress',{resourceId:$stateParams.resourceId});
      })

  })();

  function getInitialWeekRange(weekNumber, yearNumber) {
      startDate = moment(String(weekNumber - 1) + ' ' + yearNumber, 'WW YYYY').startOf('isoWeek').format();
      endDate = moment(String(weekNumber + 1) + ' ' + yearNumber, 'WW YYYY').endOf('isoWeek').day(-2).format();
      return [startDate, endDate]
  }
}
