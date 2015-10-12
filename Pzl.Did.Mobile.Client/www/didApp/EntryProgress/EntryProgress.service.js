angular.module('didApp.EntryProgressService', [])

.service('EntryProgressService', ['$http', EntryProgressService]);

function EntryProgressService($http) {
    
    var uri = 'http://localhost:52882/api/authentication'
    
    this.authenticateCredentials = function(username,password){
        var Indata = {username:username,password:password}
        return $http({
                  method  : 'POST',
                  url     : uri,
                  data    : JSON.stringify(Indata)
                 })
    }   
};