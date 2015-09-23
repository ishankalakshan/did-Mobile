angular.module('didApp.loginService', [])

.service('didApploginService', ['$http', didApploginService]);

function didApploginService($http) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var username = '';
    var isAuthenticated = false;
    var authToken;

    loadUserCrendentials();

    this.autoLogin = function () {
        loadUserCrendentials();
        if (isAuthenticated) {
            return true;
        }
    };

    this.login = function (un, pw) {
            if (un == 'user' && pw == '123') {
                storeUserCredentials(un + '.' + pw)
                return true;
            } else {
                return false;
            }
        } //end login
    this.logout = function () {
        destroyUserCredentials();
    }

    function loadUserCrendentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token !== null) {
            useCredentials(token);
        }

    }

    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
        $http.defaults.headers.common['X-Auth-Token'] = token;
    }

    function destroyUserCredentials() {
        authToken = 'undefined';
        username = '';
        isAuthenticated = false;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        $http.defaults.headers.common['X-Auth-Token'] = undefined;
    }
};