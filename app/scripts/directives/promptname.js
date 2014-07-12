'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:promptName
 * @description
 * # promptName
 */
angular.module('promptApp')
  .directive('promptName', function () {
    return {
      templateUrl: 'views/templates/promptname.html',
      restrict: 'E',
    };
  });
