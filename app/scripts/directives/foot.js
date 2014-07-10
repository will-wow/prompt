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
      template: '<div class="footer"><p><span class="glyphicon glyphicon-heart"></span> Will</p></div>',
      restrict: 'E'
    };
  });
