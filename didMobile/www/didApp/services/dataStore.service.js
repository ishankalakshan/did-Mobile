angular.module('didApp.dataStoreService', [])

.service('didAppDataStoreService', [didAppDataStoreService])

function didAppDataStoreService() {

    var localStorageTimesheet = [];
    var localStorageWeekTimesheet = [];
    var localStorageProjects = [];
    var localStorageCustomers = [];

    this.loadTolocalStorageTimesheet = function (data) {
        localStorageTimesheet = data;
    }

    this.getlocalStorageTimesheet = function () {
        return localStorageTimesheet;
    }

    this.loadTolocalStorageProjects = function(data){
        localStorageProjects = data;
    }
    
    this.getlocalStorageProjects = function(){
        return localStorageProjects ; 
    };
    
    this.loadTolocalStorageCustomers = function(data){
        localStorageCustomers = data;
    }
    
    this.getlocalStorageCustomers = function(){
        return localStorageCustomers ; 
    };
    
    

}