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
            dataUri,
            pg = phonegapStatus;
        
        //======================================================================
        // HELPERS =============================================================
        //======================================================================
        // Sets up click on phonegap
        function phonegapClickSetup() {
          var WebIntent = window.plugins.webintent,
              extras = {};
            
          extras[WebIntent.EXTRA_SUBJECT] = 'prompt data export';
          extras[WebIntent.EXTRA_TEXT]    = "My prompt data export is attached for importing.";
          extras[WebIntent.EXTRA_STREAM]  = dataUri;
          
          // Phonegap doesn't do downloads. Use a intent to send the 
          // data to email on button click
          $element.on('click', function (e) {
            WebIntent.startActivity(
              {
                action: WebIntent.ACTION_SEND,
                extras: extras,
              }, 
              function() {
                console.log('Success!');
              }, 
              function() {
                alert('Failed to open URL via Android Intent');
              }
            );
            
            // Set the ready flag
            scope.isReady = true;
          });
        }
        
        // Sets up click on browser
        function browserClickSetup() {
          // Add the data to the button for download
          $element.attr("href", dataUri);
          // Set the ready flag
          scope.isReady = true;
          
          // Add click log
          $element.on('click', function (e) {
            console.log('Clicked Export!');
          });
          
        }
        
        // Ready the file for download
        function readyFile() {
          // Get the JSON for the prompts
          var jsonPrompts = angular.toJson(Prompts.list);
          
          // generate the dataUri
          dataUri = 'data:Application/octet-stream,'+encodeURIComponent(jsonPrompts);
          
          console.log('Export generated!');
          
          // Set up click handler based on phonegap status
          pg.then(phonegapClickSetup, browserClickSetup);
        }
        
        //======================================================================
        // ON LOAD =============================================================
        //======================================================================
        // Init ready flag
        scope.isReady = false;
        
        // Get the file ready for download on load
        readyFile();
      },
      controllerAs: 'export',
      replace: true
    };
  });
