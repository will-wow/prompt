'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:RawCtrl
 * @description
 * # RawCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
  .controller('RawCtrl', ['$scope', 'Prompts', function ($scope, Prompts) {
    var scope = this,
        prompts = Prompts;
    
    // Get JSON of current prompts
    scope.prompts = angular.toJson(prompts);
    
    // Overwrite
    scope.overwritePrompts = function () {
      // empty prompts
      prompts.length = 0;
      // replace contents
      Array.prototype.push.apply(prompts, angular.fromJson(scope.prompts || []));
      
      //$scope.$apply();
      // re-pull from prompts
      scope.prompts = angular.toJson(prompts);
    };
  }]);
