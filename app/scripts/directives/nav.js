 'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:nav
 * @description
 * # nav
 */
angular.module('promptApp')
.directive('nav', function () {
    return {
      templateUrl: 'views/templates/nav.html',
      restrict: 'E'
    };
  });
