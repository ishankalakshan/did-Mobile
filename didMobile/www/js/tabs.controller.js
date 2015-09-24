angular.module('didApp.tabsController', ['angularMoment'])

.controller('tabsCtrl',['$scope','$ionicHistory','$ionicTabsDelegate','$rootScope',tabsCtrl])

function tabsCtrl($scope,$ionicHistory,$ionicTabsDelegate,$rootScope){
        
    $scope.$on("$ionicView.afterEnter", function () {
         //$ionicHistory.clearCache();
        $rootScope.$broadcast('home.clicked');
 }); 
    $scope.selectTabWithIndex = function(index) {
    
    $rootScope.$broadcast('home.clicked');
    $ionicTabsDelegate.select(index);
  }
};
