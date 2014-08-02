'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
.controller('PlayCtrl', ['$routeParams', '$location', 'Prompts', function($routeParams, $location, Prompts) {
    var scope = this,
        promptIndex = Number($routeParams.promptId);
    
    // Access the requested prompt
    scope.prompt = Prompts.list[promptIndex];
    
    scope.editPrompt = function () {
        $location.path('/load/' + promptIndex);
    };
}]);
