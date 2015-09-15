angular.module('didApp.loginController', ['angularMoment'])
.controller('loginCtrl',['$scope',loginCtrl])

function loginCtrl($scope){

  $scope.currentWeekNumber = moment().format('WW');
  $scope.currentYearNumber = moment().format('YYYY');
};
