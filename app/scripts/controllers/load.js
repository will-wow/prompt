'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:LoadCtrl
 * @description
 * # LoadCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
// Add a prompt
.controller('NewCtrl', ['$location', 'Prompts', function($location, Prompts) {
    // Set up a Prompt class 
    var scope = this,
        Prompt = function() {
        return {
            name: null,
            body: null,
            time: null
        };
    };

    // Tie a new prompt to the controller
    scope.prompt = new Prompt();
    
    // Add a new prompt
    scope.addPrompt = function() {
        // Add prompt to db
        Prompts.push(scope.prompt);

        // Go to prompt's page (use the highest index from the prompts)
        $location.path('/load/' + (Prompts.length - 1));
    };
// Edit a Prompt
}]).controller('EditCtrl', ['$routeParams', '$location', 'Prompts', function($routeParams, $location, Prompts) {
    var scope = this,
        promptIndex = Number($routeParams.promptId);
    
    // Access the requested prompt
    scope.prompt = Prompts[promptIndex];
    
    // Remove the requested prompt
    scope.removePrompt = function () {
        Prompts.splice(promptIndex, 1);
        $location.path('/load');
    };
    // Move to the prompt's play page
    scope.playPrompt = function () {
        $location.path('/play/' + promptIndex);
    };
}]);