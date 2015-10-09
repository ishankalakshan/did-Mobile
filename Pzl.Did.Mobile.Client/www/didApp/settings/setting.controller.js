angular.module('didApp.settingsController', [])

.controller('settingsCtrl',['$scope','$state','didApploginService',projectProgressCtrl])

function projectProgressCtrl($scope,$state,didApploginService){
  $scope.logout = function(){
    didApploginService.logout();
    $state.go('login')
  };
  console.log('settingsCtrl');
};
