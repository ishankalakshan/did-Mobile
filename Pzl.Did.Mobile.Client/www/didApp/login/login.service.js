angular.module('didApp.loginService', [])

.service('didApploginService', ['$http', didApploginService]);

function didApploginService($http) {
    
    var uri = 'http://localhost:52882/api/authentication'
    
    this.authenticateCredentials = function(username,password){
        var Indata = {username:username,password:password}
        return $http({
                  method  : 'POST',
                  url     : uri,
                  data    : JSON.stringify(Indata)
                 })
    }
       
    this.authenticateToken = function(){
        return $http.get(uri)
    }
    
    
    
};