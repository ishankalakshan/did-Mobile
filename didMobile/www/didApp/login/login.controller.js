angular.module('didApp.loginController', ['angularMoment'])
.controller('loginCtrl',['$scope','$state','$ionicPopup','didApploginService',loginCtrl])

function loginCtrl($scope,$state,$ionicPopup,didApploginService){

  $scope.user = {};

  ionic.Platform.ready(function(){
    if (didApploginService.autoLogin()) {
      $state.go('weekProgress');
    }
  });

  $scope.login = function(user){
    var isAuthenticated = didApploginService.login(user.username,user.password);

    if (isAuthenticated) {
      $scope.user ={};
      $state.go('weekProgress');
    }else {
      var alertPopup = $ionicPopup.alert({
      title: 'Access Denied!',
      template: 'Sorry, Invalid Credentials'
    });
    }
  };//end login

};
