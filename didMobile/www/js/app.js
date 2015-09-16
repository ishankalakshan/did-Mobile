
var didApp = angular.module('didApp', ['ionic',
                           'angularMoment',
                           'didApp.weekProgressController',
                           'didApp.loginController',
                           'didApp.dayProgressController',
                           'didApp.projectProgressController',
                           'didApp.settingsController',
                           'didApp.service',
                           'didApp.loginService',
                           'didApp.dayProgressFilter'
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
  .state('tab.weekProgress',{
        url:'/weekProgress',
        views: {
          'tab-home': {
            templateUrl: 'didApp/weekProgress/weekProgress.html',
            controller: 'weekProgressCtrl',
          }
        }
      })
  .state('tab.dayProgress', {
      url: '/dayProgress',
      views: {
        'tab-home': {
          templateUrl: 'didApp/dayProgress/dayProgress.html',
          controller: 'dayProgressCtrl'
        }
      },
      params : { selectedDate:null}
    })
  .state('tab.projectProgress', {
    url: '/projectProgress',
    views: {
      'tab-home': {
        templateUrl: 'didApp/projectProgress/projectProgress.html',
        controller: 'projectProgressCtrl'
      }
    }
  })
  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'didApp/settings/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })
  $urlRouterProvider.otherwise('/login');
});
