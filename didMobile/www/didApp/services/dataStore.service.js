angular.module('didApp.dataStoreService', [])

.service('didAppDataStoreService',[didAppDataStoreService])

function didAppDataStoreService() {

  var localStorageTimesheet = [];
  var localStorageWeekTimesheet = [];

  this.loadTolocalStorageTimesheet = function (data) {
    localStorageTimesheet = data;
  }

  this.getlocalStorageTimesheet = function () {
    return localStorageTimesheet ;
  }
}
