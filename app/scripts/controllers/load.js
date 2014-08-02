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
.controller('NewCtrl', ['$location', 'Prompts', 'Prompt', function($location, Prompts, Prompt) {
    // Set up a Prompt class 
    var scope = this;

    // Tie a new prompt to the controller
    scope.prompt = new Prompt();
    
    // Add a new prompt by hand
    scope.addPrompt = function() {
        // Add prompt to db
        Prompts.add(scope.prompt)
        .then(function (newIndex) {
            // Go to prompt's page (use the returned index)
            $location.path('/load/' + newIndex);
        });
        // TODO: notify on error
    };
// Edit a Prompt
}]).controller('EditCtrl', ['$routeParams', '$location', 'Prompts', function($routeParams, $location, Prompts) {
    var scope = this,
        promptIndex = Number($routeParams.promptId);
    
    scope.prompt = {};
    
    function localCopyPrompt (newPrompt) {
        var prompt = newPrompt || Prompts.list[promptIndex];
        
        // Get a local copy of the requested prompt
        // Using JSON seems to be the fastest way to do this
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
        if (prompt) {
            scope.prompt = JSON.parse(JSON.stringify(prompt));
        }
    }
    
    // Pull a local copy on load
    localCopyPrompt();
    
    // Push any changes to DB and persist
    scope.updatePrompt = function () {
        Prompts.update(promptIndex, scope.prompt)
        .then(function (newPrompt) {
            // Pull a new copy, just in case something weird happened
            localCopyPrompt(newPrompt);
        });
    };
    // Remove the requested prompt
    scope.removePrompt = function () {
        Prompts.remove(promptIndex)
        // Move to the all page
        .then(function () {
            $location.path('/all');
        });
    };
    // Move to the prompt's play page
    scope.playPrompt = function () {
        $location.path('/play/' + promptIndex);
    };
}]);