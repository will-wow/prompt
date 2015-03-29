'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
  .controller('SettingsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
