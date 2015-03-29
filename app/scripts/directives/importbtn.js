'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:importBtn
 * @description
 * # importBtn
 */
angular.module('promptApp')
  .directive('importBtn', function () {
    return {
      template: '<label class="btn btn-danger"><i class="fa fa-upload"></i> Import ' +
                    '<input type="file" ng-file-select="import.upload($files)" style="display:none;"></input>' +
                '</label>',
      restrict: 'E',
      controller: function ($element, $q, $scope, $location, Prompts) {
        var scope = this;

        // Ready a file for download
        scope.upload = function (files) {
          if (files) {
            // Are you sure
            var deferred = $q.defer();

            $scope.$emit('areYouSure', {
              action  : 'overwrite all data',
              body    : 'This cannot be undone!',
              deferred: deferred
            });

            // If yes
            deferred.promise.then(function () {
              // set up reader
              var reader = new FileReader();

              // set up reader callback
              // this will run after the file is parsed
              reader.onload = function () {
                var newPrompts;

                // Replace the prompts with the file's info
                try {
                  // Try decoding the output from ANSII
                  newPrompts = angular.fromJson(decodeURIComponent(escape(reader.result))) || []; // jshint ignore:line
                } catch (e) {
                  try {
                    // If that didn't work, it may be UTF-8
                    // Try importing without decoding
                    newPrompts = angular.fromJson(reader.result) || [];
                  } catch (e) {
                    // If that didn't work, there was a problem.
                    // Write that to the console, and quit
                    console.log('There was a problem with the import!');
                    return;
                  }
                }

                // Replace the prompts list with the newprompts
                Prompts.replace(newPrompts)
                // Move to the prompts page when replace is finished
                .then(function () {
                  $location.path('/');
                });
              };

              // read in the file
              reader.readAsText(files[0]);
            });
          }
        };

      },
      controllerAs: 'import',
      replace: true
    };
  });
