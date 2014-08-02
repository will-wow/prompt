'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:AllCtrl
 * @description
 * # AllCtrl
 * Controller of the promptApp
 */
angular.module('promptApp').controller('AllCtrl', ['$scope', '$location', '$upload', 'Prompts', 'Prompt', function($scope, $location, $upload, Prompts, Prompt) {
    var scope = this,
        readerOnLoad = (function (i, fileCount, file, reader, prompt) {
            return function (e) {
                // Populate the prompt object
                prompt.name = file.name.replace(/\..+$/, '');
                prompt.body = reader.result;
                prompt.time = 0;
                
                // Add it to the Prompts array
                Prompts.add(prompt);
                
                // If this is the last file, note that in the scope
                if (i === fileCount-1) {
                    scope.uploadStatus = scope.uStats.DONE;
                    $scope.$apply();
                }
            };
        });
    
    // Status Types
    scope.uStats = {
        NONE:       0,
        STARTED:    1,
        DONE:       2
    };
    
    // current status
    scope.uploadStatus = scope.uStats.NONE;
    
    // Upload a prompt file
    scope.upload = function ($files) {
        var fileCount = $files.length;
        
        if (fileCount) {
            // Set status as started
            scope.uploadStatus = scope.uStats.STARTED;
        
            // Loop through uploaded files
            for (var i = 0; i < fileCount; i++) {
                var file = $files[i],
                    reader = new FileReader(),
                    prompt = new Prompt();
                
                // set up reader callback 
                reader.onload = readerOnLoad(i, fileCount, file, reader, prompt);
                // read in the file
                reader.readAsText(file);
            }
        }
    };
    
    // Move to the prompt's play page
    scope.play = function (promptIndex) {
        $location.path('/play/' + promptIndex);
    };
    // Move to the prompt's edit page
    scope.edit = function (promptIndex) {
        $location.path('/load/' + promptIndex);
    };
    // Remove the requested prompt
    scope.remove = function(promptIndex) {
        Prompts.delete(promptIndex);
    };
    
    scope.clearAll = function () {
        Prompts.clear();
    };
}]);
