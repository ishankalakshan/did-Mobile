
var didApp = angular.module('didApp', ['ionic',
                           'angularMoment',
                           'didApp.weekProgressController',
                           'didApp.loginController',
                           'didApp.dayProgressController',
                           'didApp.projectProgressController',
                           'didApp.service'
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

  .state('login',{
        url:'/login',
        templateUrl:'didApp/login/login.html',
        controller:'loginCtrl'
      })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'didApp/tabs.html'
  })
  // Each tab has its own nav history stack:
  .state('tab.weekProgress',{
        url:'/weekProgress',
        views: {
          'tab-home': {
            templateUrl: 'didApp/weekProgress/weekProgress.html',
            controller: 'weekProgressCtrl',
          }
        },
        params : {currentWeekNumber : '',
              currentYearNumber : ''}
      })

  .state('tab.dayProgress', {
      url: '/dayProgress',
      views: {
        'tab-home': {
          templateUrl: 'didApp/dayProgress/dayProgress.html',
          controller: 'dayProgressCtrl'
        }
      }
    })

  .state('tab.projectProgress', {
    url: '/projectProgress',
    views: {
      'tab-home': {
        templateUrl: 'didApp/projectProgress/projectProgress.html',
        controller: 'projectProgressCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
