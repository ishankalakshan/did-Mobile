angular.module('didApp.EntryProgressService', [])

.service('EntryProgressService', ['$http', EntryProgressService]);

function EntryProgressService($http) {
    
    var uri = 'http://localhost:52882/api/timeentries'
    
    this.ApproveThisWeek = function(id,customerKey,customerKeyId,projectKey,projectKeyId){
        var Indata = {id:id,customerKey:customerKey,customerKeyId:customerKeyId,projectKey:projectKey,projectKeyId:projectKeyId}
        return $http({
                  method  : 'POST',
                  url     : uri,
                  data    : JSON.stringify(Indata)
                 })
    }   
    this.ignoreEntry = function(id){
        var Indata = {id:id}
        return $http({
                  method  : 'POST',
                  url     : uri+"/ignore",
                  data    : JSON.stringify(Indata)
                 })
    } 
    this.privateEntry = function(id){
        var Indata = {id:id}
        return $http({
                  method  : 'POST',
                  url     : uri+"/private",
                  data    : JSON.stringify(Indata)
                 })
    } 
};