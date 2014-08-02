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
    var scope = this;
    
    // Get JSON of current prompts
    scope.prompts = angular.toJson(Prompts.list);
    
    // Overwrite
    scope.overwritePrompts = function () {
      Prompts.replace(scope.prompts || []);
      
      // re-pull from prompts, add the JSON back to local scope
      scope.prompts = angular.toJson(Prompts.list);
    };
  }]);
