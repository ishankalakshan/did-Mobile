angular.module('didApp.dataLoadService', [])
.service('didAppDataLoadService', ['$ionicLoading','$q','$rootScope','didAppDataService','didAppDataStoreService',didAppDataLoadService])

function didAppDataLoadService($ionicLoading,$q,$rootScope,didAppDataService,didAppDataStoreService){

  var timesheet = [];

  this.requestProjects = function () {
      var projectList =[];
      didAppDataService.getProjects()
          .then(function (result) {
              result.data.forEach(function (b) {
                  projectList.push({
                      id: b.Id,
                      title: b.Title,
                      customerKeyId: b.CustomerKeyId,
                      customerKey: b.CustomerKey,
                      key: b.Key
                  });
              });

          }, function (err) {
              console.log(err);
          })
          .then(function () {
              didAppDataStoreService.loadTolocalStorageProjects(projectList);
          });
  } //load project data to localDataStorage Service

  this.requestCustomers = function () {
      var customerList = [];
      didAppDataService.getCustomers()
          .then(function (result) {
              result.data.forEach(function (b) {
                  customerList.push({
                      id: b.Id,
                      title: b.Title,
                      key: b.Key
                  });
              });

          }, function (err) {
              console.log(err)
          })
          .then(function () {
              didAppDataStoreService.loadTolocalStorageCustomers(customerList);
          });
  } //load customers data to localDataStorage Service

  this.requestTimesheet = function (start, end) {
      timesheet = [];
      var q = $q.defer()
      $ionicLoading.show({
          template: "<div><i class='fa fa-spinner fa-spin'></i> Loading Data...</div>"
      });

      didAppDataService.getTimeEntries(start, end)
          .then(function (result) {
            console.log(result);
              setTimeEntriesData(result);
          }, function (err) {
              console.log(err)
              $ionicLoading.hide();
          })
          .then(function () {
              didAppDataStoreService.loadTolocalStorageTimesheet(timesheet);
              q.resolve('true')
              $ionicLoading.hide();
          }, function (err) {
              console.log(err);
              q.reject('Noooooooo')
              $ionicLoading.hide()
          });
          return q.promise
  } //load timesheet data to localDataStorage Service

  this.requestMoreTimesheet = function (start, end) {

      var q = $q.defer()
      $ionicLoading.show({
          template: "<div><i class='fa fa-spinner fa-spin'></i> Loading...</div>"
      });

      didAppDataService.getTimeEntries(start, end)
          .then(function (result) {
              setTimeEntriesData(result);
          }, function (err) {
              console.log(err)
              $ionicLoading.hide();
          })
          .then(function () {
              didAppDataStoreService.loadTolocalStorageTimesheet(timesheet);
              q.resolve('true')
              $ionicLoading.hide();
          }, function (err) {
              console.log(err);
              q.reject('Noooooooo')
              $ionicLoading.hide()
          });
          return q.promise
  }

  function setTimeEntriesData(result) {
      result.data.forEach(function (b) {
          timesheet.push({
              id: b.Id,
              title: b.Title,
              startTime: b.StartTime,
              endTime: b.EndTime,
              duration: b.Duration,
              timezone: b.Timezone,
              description: b.Description,
              state: b.State,
              customerKeyId: b.CustomerKeyId,
              projectKeyId: b.ProjectKeyId,
              resourceKeyId: b.ResourceKeyId,
              weekNumber: b.WeekNumber,
              yearNumber: b.YearNumber
          });
      });
  }
}
