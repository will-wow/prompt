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
      template: '<div class="footer">Fork me on <a href="http://github.com/whenther/prompt"><span class="fa fa-github"></span> Github</a></div>',
      restrict: 'E'
    };
  });
