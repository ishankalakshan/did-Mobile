angular.module('didApp.EntryProgressService', [])

.service('EntryProgressService', ['$http', EntryProgressService]);

function EntryProgressService($http) {
    
    var uri = 'http://localhost:52882/api/timeentries'
    
    this.ApproveThisWeek = function(id,customerKey,customerKeyId,projectKey,projectKeyId){
        console.log(id,customerKey,customerKeyId,projectKey,projectKeyId)
        var Indata = {id:id,customerKey:customerKey,customerKeyId:customerKeyId,projectKey:projectKey,projectKeyId:projectKeyId}
        return $http({
                  method  : 'POST',
                  url     : uri,
                  data    : JSON.stringify(Indata)
                 })
    }   
};