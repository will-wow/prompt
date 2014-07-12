'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:AllCtrl
 * @description
 * # AllCtrl
 * Controller of the promptApp
 */
angular.module('promptApp').controller('AllCtrl', ['$location', 'Prompts', function($location, Prompts) {
    var scope = this;
    
    // Move to the prompt's play page
    scope.play = function (promptIndex) {
        $location.path('/play/' + promptIndex);
    };
    // Move to the prompt's play page
    scope.edit = function (promptIndex) {
        $location.path('/load/' + promptIndex);
    };
        // Remove the requested prompt
    scope.remove = function(promptIndex) {
        Prompts.splice(promptIndex, 1);
    };
    
    scope.clearAll = function () {
        Prompts.length = 0;
    };
}]);
