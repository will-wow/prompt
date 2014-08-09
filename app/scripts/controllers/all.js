'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:AllCtrl
 * @description
 * # AllCtrl
 * Controller of the promptApp
 */
angular.module('promptApp').controller('AllCtrl', ['$scope', '$location', '$upload', '$q', 'Prompts', 'Prompt', function($scope, $location, $upload, $q, Prompts, Prompt) {
    var scope = this,
        readerOnLoad = (function (i, fileCount, file, reader, prompt) {
            return function (e) {
                // Populate the prompt object
                prompt.name = file.name.replace(/\..+$/, '');
                prompt.body = reader.result.trim();
                prompt.time = 0;
                
                // Add info from any included JSON
                addInfoFromJSON(prompt);
                
                // Add the new prompt to the Prompts array
                Prompts.add(prompt)
                .then(function (e) {
                    // If this is the last file, note that in the scope
                    if (i === fileCount-1) {
                        scope.uploadStatus = scope.uStats.DONE;
                        //$scope.$apply();
                    } 
                });
            };
        });
    
    // Check if a string is JSON
    function tryToParseJSON(text) {
        try {
            return JSON.parse(text);
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Convert a time string to ms
     */
    function timeToMs (time) {
      var splitTime, splitTimeLength;
      
      //====================================================================
      // Format the time
      //====================================================================
      // Make sure time is a string
      time = time.toString().trim();
      
      splitTime = time.split(':');
      splitTimeLength = splitTime.length;
      
      if (splitTimeLength === 1) {
        // sec
        time =  '00:00:' + time;
      } else if (splitTimeLength === 2) {
        // min:sec
        time =  '00:' + time;
      } else if (splitTimeLength === 3) {
        // hrs:min:sec
        // DO NOTHING (time is properly formatted)
      } else if (splitTimeLength >= 4) {
        // More than hrs:min:sec
        time =  splitTime[splitTimeLength-3] + ':' + 
                splitTime[splitTimeLength-2] + ':' + 
                splitTime[splitTimeLength-1] + ':';
      } else {
        // Anything weird
        time =  '00:00';
      }
      
      //====================================================================
      // Return time in ms
      //====================================================================
      return Date.parse("01 Jan 1970 " + time + " UTC");
    }
    
    // Look for and pull out JSON from body text
    function findJSON(body) {
        // Split into array of lines
        var lines = body.split('\n'),
            i, info, jsonFound = false,
            linesChecked = '',
            otherLines = '',
            returnObj;
        
        // Loop through each line
        for (i = lines.length-1; i >= 0; i--) {
            // Add the next line to the linesChecked
            // Note that it starts at the bottom, and works its way up
            // So it add the new line first
            
            if (jsonFound) {
                otherLines = lines[i] + otherLines;
            } else {
                // Build new string to try
                linesChecked = lines[i] + linesChecked;
            
                // Try to convert it to JSON
                info = tryToParseJSON(linesChecked);
                
                // If it worked, that's the json tag
                // Otherwise continue looping
                if (info) {
                    // Build the return object
                    returnObj = {
                        // Flag that JSON found
                        hasJSON : true,
                        // Return the JSON object
                        json    : info,
                        // Return the line split at, 
                        // So another function can remove the JSON text
                        splitAt : i
                    };
                    // Set the jsonFound flag
                    jsonFound = true;
                }
                
            }
        }
        // If JSON was found
        if (jsonFound) {
            // Add in the rest of the body to the return object
            // Trim off any trailing whitespace
            returnObj.body = otherLines.trim();
        } else {
            // Just set the hasJSON flag as false
            returnObj = {hasJSON: false};
        }
        
        // Return
        return returnObj;
    }
    
    // Find JSON info, and add it to the prompt
    function addInfoFromJSON(prompt) {
        var jsonChecked = findJSON(prompt.body);
        
        if (jsonChecked.hasJSON) {
            var info = jsonChecked.json;
            
            // Merge info into prompt
            prompt.name = info.name             || prompt.name;
            prompt.time = timeToMs(info.time)   || prompt.time;
            prompt.notes= info.notes            || prompt.notes;
            prompt.body = jsonChecked.body      || prompt.body;
            
        }
    }
    
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
    scope.remove = function(promptIndex, promptID) {
        var deferred = $q.defer();
        
        $scope.$emit('areYouSure', {
            action  : 'delete ' + Prompts.list[promptIndex],
            body    : 'This cannot be undone!',
            deferred: deferred
        });
        
        deferred.promise.then(function () {
            Prompts.delete(promptID)
            // A blank function seems to get the scope to update
            .then(function () {});
        });
    };
    
    scope.clearAll = function () {
        var deferred = $q.defer();
        
        $scope.$emit('areYouSure', {
            action  : 'clear all data',
            body    : 'This cannot be undone!',
            deferred: deferred
        });
        
        deferred.promise.then(function () {
            Prompts.clear()
            // A blank function seems to get the scope to update
            .then(function () {});
        });
    };
}]);
