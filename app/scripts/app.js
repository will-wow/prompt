'use strict';

/**
 * @ngdoc overview
 * @name promptApp
 * @description
 * # promptApp
 *
 * Main module of the application.
 */
angular
  .module('promptApp', [
    'ngRoute',
    'ngSanitize',
    'duScroll',
    'LocalStorageModule',
    'angularMoment'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/about.html'
      })
      .when('/load', {
        templateUrl: 'views/load.html',
        controller: 'NewCtrl',
        controllerAs: 'new',
      }) 
      .when('/load/:promptId', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl',
        controllerAs: 'edit'
      })
      .when('/play', {
        templateUrl: 'views/play.html',
        controller: 'ChooseCtrl'
      })
      .when('/play/:promptId', {
        templateUrl: 'views/play.html',
        controller: 'PlayCtrl',
        controllerAs: 'play'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
