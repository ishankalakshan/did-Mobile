angular.module('didApp.loginController', ['angularMoment'])
    .controller('loginCtrl', ['$scope', '$http', '$rootScope', '$state', '$ionicPopup', 'didApploginService', loginCtrl])

function loginCtrl($scope, $http, $rootScope, $state, $ionicPopup, didApploginService) {

    $scope.user = {
        username: 'ishankaw@99x.lk',
        password: '912701395Vv'
    };
    var resourceId = null;
    var key = CryptoJS.enc.Utf8.parse('7061737323313233');
    var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
    var LOCAL_AUTH_KEY = null;

    loadUserCrendentials();

        (function () {
            if (LOCAL_AUTH_KEY != null) {
                didApploginService.authenticateToken(LOCAL_AUTH_KEY)
                    .then(function (result) {
                            if (result.data != null) {
                                $state.go('weekProgress');
                            } else {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Access Denied!',
                                    template: 'Sorry, Invalid Credentials'
                                });
                            }
                        },
                        function (err) {
                            console.log(err);
                        });
            }
        })();

    function generateToken(username, password, resourceId) {



        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(username + ":" + password + ":" + resourceId), key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted
    };

    function loadUserCrendentials() {
        LOCAL_AUTH_KEY = window.localStorage.getItem("LOCAL_AUTH_KEY");
        $http.defaults.headers.common['Authorization'] = LOCAL_AUTH_KEY;
        console.log(LOCAL_AUTH_KEY)
    }

    function storeUserCredentials(token) {

        console.log(token.toString())
        var decrypted = CryptoJS.AES.decrypt(token, key, {
            iv: iv
        });
        console.log(decrypted.toString(CryptoJS.enc.Utf8));

        LOCAL_AUTH_KEY = token.toString()

        window.localStorage.setItem("LOCAL_AUTH_KEY", token.toString());

        $http.defaults.headers.common['Authorization'] = token;
    }

    function destroyUserCredentials() {
        LOCAL_AUTH_KEY = null;
        window.localStorage.removeItem("LOCAL_AUTH_KEY");
        $http.defaults.headers.common['Authorization'] = undefined;
    }

    $scope.login = function (user) {
        if (user.username == undefined || user.password == undefined) {
            var alertPopup = $ionicPopup.alert({
                title: 'Alert',
                template: 'Please enter a valid email and a password!'
            });
        } else {
            didApploginService.authenticateCredentials(user.username, user.password)
                .then(function (result) {
                    $scope.user = {};
                    if (result.data != null) {
                        resourceId = result.data[0].Id;
                        console.log(resourceId)
                        storeUserCredentials(generateToken(user.username, user.password, resourceId));
                        $state.go('weekProgress');
                    } else if (result.data == null) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Alert',
                            template: 'Invalid credentials.Please try again'
                        });
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Alert',
                            template: 'Login Failed.Please try again'
                        });
                    }

                }, function (err) {
                    console.log(err);
                })
        }
    }; //end login

    $rootScope.$on('logout', function () {
        destroyUserCredentials();
    });

};