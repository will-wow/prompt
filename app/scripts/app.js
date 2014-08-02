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
    'angularFileUpload',
    'angularMSTime'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/prompts'
      })
      .when('/prompts', {
        templateUrl: 'views/all.html',
        controller: 'AllCtrl',
        controllerAs: 'all'
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
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/raw', {
        templateUrl: 'views/raw.html',
        controller: 'RawCtrl',
        controllerAs: 'raw'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
