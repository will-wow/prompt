'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:exportBtn
 * @description
 * # exportBtn
 */
angular.module('promptApp')
  .directive('exportBtn', function () {
    return {
      template: '<a class="btn btn-info" download="prompt.json" ng-enabled="export.isReady"><i class="fa fa-download"></i> Export</a>',
      restrict: 'E',
      controller: function ($element, $q, Prompts, phonegapStatus) {
        var scope = this,
            pg = phonegapStatus;

        //======================================================================
        // HELPERS =============================================================
        //======================================================================
        // Build a filename with the current date
        function currentFileName() {
          // Get the current date to append to the filename (for ordering and non-cacheing)
          var d               = new Date(),
          // Make the date filename-safe
          // Note that javascript months start at 0
              dateString      = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'-'+d.getHours()+'-'+d.getMinutes();

          return ('prompt_export_' + dateString + '.json');
        }

        // Generate the export data
        function generateExportData() {
          var jsonPrompts     = angular.toJson(Prompts.list);
          return unescape(encodeURIComponent(jsonPrompts)); // jshint ignore:line
        }

        // Sets up click on phonegap
        function phonegapClickSetup() {
          // Set up data
          var subject         = 'prompt data export',
              body            = 'My prompt data export is attached for importing.',

              fileName        = currentFileName(),
              // build data attachment
              base64Data      = window.btoa(generateExportData()),
              // Set up the attachment array
              attachmentsData = [[fileName, base64Data]];

          console.log('Export email generated!');

          // Phonegap doesn't do downloads. Use a intent to send the
          // data to email on button click
          $element.on('click', function () {
            // Send the data to email
            window.plugins.emailComposer.showEmailComposerWithCallback(null,subject,body,null,null,null,null,null,attachmentsData);
            console.log('Clicked Export!');
          });

          // Set the ready flag
          scope.isReady = true;
        }

        // Sets up click on browser
        function browserClickSetup() {
          // Get the JSON for the prompts
          var jsonPrompts = angular.toJson(Prompts.list);

          // Add the data to the button for download
          $element.attr('href', 'data:text/plain;charset=US-ASCII,' + unescape(encodeURIComponent(jsonPrompts))); // jshint ignore:line
          // Set the new filename
          $element.attr('download', currentFileName());
          // Set the ready flag
          scope.isReady = true;

          console.log('Export link generated!');

          // Add click log
          $element.on('click', function () {
            console.log('Clicked Export!');
          });
        }

        //======================================================================
        // ON LOAD =============================================================
        //======================================================================
        // Init ready flag
        scope.isReady = false;

        // Get the file ready for download on load
        pg.then(phonegapClickSetup, browserClickSetup);
      },
      controllerAs: 'export',
      replace: true
    };
  });
