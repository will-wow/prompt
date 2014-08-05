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
          var file;
        
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
  
          function gotFS(fileSystem) {
              fileSystem.root.getFile("prompt.json", {create: true, exclusive: false}, gotFileEntry, fail);
          }
  
          function gotFileEntry(fileEntry) {
              // save ref to fileEntry
              file = fileEntry;
              // Set up the writer
              fileEntry.createWriter(gotFileWriter, fail);
          }
          
          function gotFileWriter(writer) {
              writer.onwriteend = sendEmailIntent;
              // Write the prompts list to the file
              writer.write(angular.toJson(Prompts.list));
              
              console.log('Export file ready!');
          }
          
          function sendEmailIntent() {
            var WebIntent = window.plugins.webintent,
                extras = {};
              
            extras[WebIntent.EXTRA_SUBJECT] = 'prompt data export';
            extras[WebIntent.EXTRA_TEXT]    = "My prompt data export is attached for importing.";
            extras[WebIntent.EXTRA_STREAM]  = file;
            
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
          
          function fail(error) {
              console.log(error.code);
          }
        }
        
        // Sets up click on browser
        function browserClickSetup() {
          // Get the JSON for the prompts
          var jsonPrompts = angular.toJson(Prompts.list);
          
          // Add the data to the button for download
          $element.attr("href", 'data:Application/octet-stream,'+encodeURIComponent(jsonPrompts));
          // Set the ready flag
          scope.isReady = true;
          
          console.log('Export link generated!');
          
          // Add click log
          $element.on('click', function (e) {
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
