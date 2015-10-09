angular.module('didApp.tabsController', ['angularMoment'])

.controller('tabsCtrl',['$scope','$ionicHistory','$ionicTabsDelegate','$rootScope',tabsCtrl])

function tabsCtrl($scope,$ionicHistory,$ionicTabsDelegate,$rootScope){
        
    $scope.$on("$ionicView.beforeLeave", function () {
         //$ionicHistory.clearHistory();
       // $rootScope.$broadcast('home.clicked');
 }); 
    $scope.selectTabWithIndex = function(index) {
    
    $ionicTabsDelegate.select(index);
    $rootScope.$broadcast('home.clicked');
  }
};
