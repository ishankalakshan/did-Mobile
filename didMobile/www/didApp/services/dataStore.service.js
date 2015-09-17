angular.module('didApp.dataStoreService', [])

.service('didAppDataStoreService',[didAppDataStoreService])

function didAppDataStoreService() {

  var localStorageTimesheet = [];
  var localStorageWeekTimesheet = [];
  var localStorageTimesheetById = {};

  this.loadTolocalStorageTimesheet = function (data) {
    localStorageTimesheet = data;
  }

  this.getlocalStorageTimesheet = function () {
    return localStorageTimesheet ;
  }

}
