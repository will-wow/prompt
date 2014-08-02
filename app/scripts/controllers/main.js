'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promptApp
 */
angular.module('promptApp').controller('MainCtrl', ['Prompts', function(Prompts) {
    var scope = this;
    
    // make all prompts available
    scope.prompts = Prompts.list;
    // make the ready() function available
    // app should disable prompt access until ready
    scope.ready = Prompts.ready;
}]);
