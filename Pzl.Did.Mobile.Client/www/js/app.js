var didApp = angular.module('didApp', ['ionic',
  'angularMoment',
  'didApp.dataLoadController',
  'didApp.weekProgressController',
  'didApp.loginController',
  'didApp.dayProgressController',
  'didApp.EntryProgressController',
  'didApp.service',
  'didApp.loginService',
  'didApp.dataStoreService',
  'didApp.successScreenController',
  'didApp.errorScreenController',
  'didApp.EntryProgressService',
  'didApp.WeekProgressService',
  'didApp.dataLoadService'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'didApp/login/login.html',
      controller: 'loginCtrl'
    })
    .state('dataLoad', {
      url: '/dataLoad',
      templateUrl: 'didApp/DataLoad/dataLoad.html',
      controller: 'dataLoadCtrl',
      params: {
        resourceId: null
      }
    })
    .state('weekProgress', {
      url: '/weekProgress',
      templateUrl: 'didApp/weekProgress/weekProgress.html',
      controller: 'weekProgressCtrl',
      params: {
        resourceId: null
      }
    })
    .state('dayProgress', {
      url: '/dayProgress',
      templateUrl: 'didApp/dayProgress/dayProgress.html',
      controller: 'dayProgressCtrl',
      params: {
        selectedDate: null
      }
    })
    .state('EntryProgress', {
      url: '/EntryProgress',
      templateUrl: 'didApp/EntryProgress/EntryProgress.html',
      controller: 'EntryProgressCtrl',
      params: {
        selectedId: null
      }
    })
    .state('confirmed', {
      url: '/confirmed',
      templateUrl: 'didApp/WhatIDid/successScreen.html',
      controller: 'successScreenCtrl'
    })
  $urlRouterProvider.otherwise('/login');
});
