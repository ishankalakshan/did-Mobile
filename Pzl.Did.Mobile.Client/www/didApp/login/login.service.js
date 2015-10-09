angular.module('didApp.loginService', [])

.service('didApploginService', ['$http', didApploginService]);

function didApploginService($http) {
    
    var uri = 'http://localhost:52882/api/authentication'
    
    this.authenticateCredentials = function(username,password){
        return $http.get(uri + '/' + username + '/' + password)
    }
    
/*    this.authenticateCredentials = function(username,password){
        var Indata = {param:username,password}
        return $http({
                  method  : 'POST',
                  url     : 'http://localhost:52882/api/authentication',
                  data    : Indata
                 })
    }*/
    
    this.authenticateToken = function(){
        return $http.get(uri)
    }
    
    
    
};