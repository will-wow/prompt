'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
.controller('PlayCtrl', ['$routeParams', 'Prompts', function($routeParams, Prompts) {
    var scope = this,
        promptIndex = Number($routeParams.promptId);
    
    // Access the requested prompt
    scope.prompt = Prompts[promptIndex];
}]);
