angular.module('didApp.loginService', [])

.service('didApploginService', ['$http', didApploginService]);

function didApploginService($http) {
    
    var uri = 'http://localhost:55614/api/authentication'
    
    this.authenticateCredentials = function(username,password){
        return $http.get(uri + '/' + username + '/' + password)
    }
    this.authenticateToken = function(token){
        return $http.get(uri + '/' + token)
    }
    
};