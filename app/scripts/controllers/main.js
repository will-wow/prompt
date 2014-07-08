'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
