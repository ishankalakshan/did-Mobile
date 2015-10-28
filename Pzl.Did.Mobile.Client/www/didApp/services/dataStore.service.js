angular.module('didApp.dataStoreService', [])

.service('didAppDataStoreService', [didAppDataStoreService])

function didAppDataStoreService() {

    var localStorageTimesheet = [];
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

    this.updateEntryState=function(id,state){
        localStorageTimesheet.forEach(function(entry){
            if(entry.id==id){
                entry.state = state
                return;
               }
        })
    }

    this.updateEntryCustomerProjectState=function(id,customerKeyId,projectKeyId,state){
        localStorageTimesheet.forEach(function(entry){
            if(entry.id==id){
                entry.customerKeyId = customerKeyId
                entry.projectKeyId = projectKeyId
                entry.state = state
                return;
               }
        })
    }

    this.updateEntryApproved=function(thisWeeksConfirmedIds, thisWeeksIgnoredIds){
        localStorageTimesheet.forEach(function(entry){

            thisWeeksConfirmedIds.forEach(function(id){
                if(entry.id==id.id){
                entry.state = "Approved"
               }
            })

            thisWeeksIgnoredIds.forEach(function(id){
                if(entry.id==id.id){
                entry.state = "IgnoreApproved"
               }
            })

        })
    }
}
