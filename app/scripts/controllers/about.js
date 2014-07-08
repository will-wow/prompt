'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
