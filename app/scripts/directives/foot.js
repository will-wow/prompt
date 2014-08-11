'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:foot
 * @description
 * # foot
 */
angular.module('promptApp')
  .directive('foot', function () {
    return {
      templateUrl: 'views/templates/foot.html',
      restrict: 'E'
    };
  });
