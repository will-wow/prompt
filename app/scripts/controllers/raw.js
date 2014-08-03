'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:RawCtrl
 * @description
 * # RawCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
  .controller('RawCtrl', ['$scope', '$q', 'Prompts', function ($scope, $q, Prompts) {
    var scope = this;
    
    // Get JSON of current prompts
    scope.prompts = angular.toJson(Prompts.list);
    
    // Overwrite
    scope.overwritePrompts = function () {
      var deferred = $q.defer();
      
      $scope.$emit('areYouSure', {
          action  : 'overwrite all data',
          body    : 'This cannot be undone!',
          deferred: deferred
      });
      
      deferred.promise.then(function () {
        Prompts.replace(angular.fromJson(scope.prompts) || [])
        .then(function () {
          // re-pull from prompts, add the JSON back to local scope
          scope.prompts = angular.toJson(Prompts.list);
        });
      });
    };
  }]);
