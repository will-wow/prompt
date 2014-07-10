'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promptApp
 */
angular.module('promptApp').controller('MainCtrl', ['$scope', 'localStorageService', 'Prompts', function($scope, localStorageService, Prompts) {
    var promptsInStore = localStorageService.get('prompts'),
        scope = this;

    scope.prompts = Prompts;

    // Watch the prompts for change
    $scope.$watch(function() {
        return scope.prompts;
    }, function() {
        localStorageService.add('prompts', JSON.stringify(scope.prompts));
    }, true);
}]);
