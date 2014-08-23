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
        // Returns a reader onLoad function
        readerOnLoad = (function (i, fileCount, file, reader, prompt) {
            return function (e) {
                // Populate the prompt object
                prompt.name = file.name.replace(/\..+$/, '');
                prompt.body = reader.result.trim();
                prompt.time = 0;
                
                // Add info from any included JSON
                parseBody(prompt);
                
                // Add the new prompt to the Prompts array
                Prompts.add(prompt)
                .then(function (e) {
                    // If this is the last file, note that in the scope
                    if (i === fileCount-1) {
                        scope.uploadStatus = scope.uStats.DONE;
                    } 
                });
            };
        });
    
    //==========================================================================
    // INFO PULLER FUNCTIONS ===================================================
    //==========================================================================
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
      
      //===================
      // Return time in ms
      //===================
      return Date.parse("01 Jan 1970 " + time + " UTC");
    }
    
    // Split the body text at newlines
    function splitBody(body) {
        // Split at newlines
        var split = body.split('\n');
        
        // Make sure to always return an array
        if (!Array.isArray(split)) {
            split = [split];
        }
        
        // return
        return split;
    }
    
    // Pull out note sections
    function pullNotes(lines, stopAt) {
        // Holds concatenated text
        var bodyText = '',
            noteText = '',
            
            // Skip block
            inSkip = false,
            SKIP_START  = '==PROMPT SKIP==',
            SKIP_END    = '==END SKIP==',
            // Notes block
            inNotes = false,
            NOTES_START = '==PROMPT NOTES==',
            NOTES_END   = '==END NOTES==';
        
        // Loop through body (before stopat)
        for (var i=0; i < stopAt; i++) {
            var line = lines[i];
            
            //================================
            // SKIP BLOCK ====================
            //================================
            if (inSkip) {
                if (line.trim() === SKIP_END) {
                    inSkip = false;
                }
            
            //================================
            // NOTES BLOCK ===================
            //================================
            } else if (inNotes) {
                if (line.trim() === NOTES_END) {
                    // If this line ends the notes block
                    
                    // set inNotes flag
                    // Don't write this line to anything
                    inNotes = false;
                } else {
                    // Line is still in notes block
                    
                    // Write to bodyText
                    noteText += line;
                }
            
            //================================
            // REGULAR TEXT ==================
            //================================
            } else {
                // START NOTES BLOCK
                if (line.trim() === NOTES_START) {
                    // If this line starts a notes block
                    
                    // Check if there are notes already
                    if (noteText) {
                        // If there are, add an <hr/>
                        noteText += '<hr/>\n';
                    }
                    // set inNotes flag
                    // Don't write this line to anything
                    inNotes = true;
                // START SKIP BLOCK
                } else if (line.trim() === SKIP_START) {
                    // If this line starts a SKIP block
                    
                    // set inSkip flag
                    // Don't write this line to anything
                    inSkip = true;
                } else {
                    // if line is regular text
                    
                    // Write to bodyText
                    bodyText += line;
                }
            }
        }
        
        // When done, return both strings
        return {
            body:  bodyText.trim(),
            notes: noteText.trim()
        };
    }
    
    // Check if a string is JSON
    function tryToParseJSON(text) {
        try {
            return JSON.parse(text);
        } catch (e) {
            return false;
        }
    }
    
    // Look for and pull out JSON from body text
    function pullJSON(lines) {
        // Split into array of lines
        var i, info,
            linesChecked = '',
            notFoundReturn = {};
        
        // Loop through each line
        for (i = lines.length-1; i >= 0; i--) {
            // Add the next line to the linesChecked
            // Note that it starts at the bottom, and works its way up
            // So it add the new line first
            

            // Build new string to try
            linesChecked = lines[i] + linesChecked;
        
            // Try to convert it to JSON
            info = tryToParseJSON(linesChecked);
            
            // If it worked, that's the json object
            // Otherwise continue looping
            if (info) {
                // Make sure it's a PROMPT json object (not something else)
                if (info.PROMPT) {
                    // Return the json
                    // And the line# the JSON starts at
                    return {
                        // Return the JSON object
                        json    : info.PROMPT,
                        // Return the first line# of JSON
                        // So the next function knows where to stop
                        stopAt : i
                    };
                } else {
                    // If it's not a PROMPT JSON object, return as if not found
                    return notFoundReturn;
                }
            }
        }
        
        // If the code gets here, JSON not found
        return notFoundReturn;
    }
    
    // Find JSON info and Notes blocks, and pull them from the main body
    function parseBody(prompt) {
        // Replace "smart" quotes in body, to allow JSON to always work
        prompt.body = prompt.body.replace(/[\u201C|\u201D|\u201E]/g, "\"");
        
        var lines = splitBody(prompt.body),
            // Search for and pull out JSON and notes
            jsonPulled      = pullJSON(lines),
            notesPulled     = pullNotes(lines, jsonPulled.stopAt || lines.length),
            // Grab the pulled objects
            info            = jsonPulled.json,
            notes           = notesPulled.notes;
        
        // Check if anything was found. If not, do nothing
        if (info || notes) {
            // Merge JSON info into Prompt
            if (info) {
                prompt.name = info.name             || prompt.name;
                prompt.time = timeToMs(info.time)   || prompt.time;
            }
            
            // Merge notes info into Prompt
            if (notes) {
                prompt.notes = notes;
            }
            
            // Since pullNotes stripped out the JSON, use its body either way
            prompt.body = notesPulled.body;
        }
    }
    
    //==========================================================================
    // SCOPE ===================================================================
    //==========================================================================
    
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
