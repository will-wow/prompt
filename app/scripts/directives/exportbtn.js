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
        
        
        // Sets up click on phonegap
        function phonegapClickSetup() {
          // Set up data
          var subject         = 'prompt data export',
              body            = 'My prompt data export is attached for importing.',
              
              // build data attachment
              jsonPrompts     = angular.toJson(Prompts.list),
              base64Data      = window.btoa(unescape(encodeURIComponent(jsonPrompts))),
              attachmentsData = [['prompt.json', base64Data]];
          
          console.log('Export email generated!');
          
          // Phonegap doesn't do downloads. Use a intent to send the 
          // data to email on button click
          $element.on('click', function (e) {
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
          $element.attr("href", 'data:text/plain;charset=US-ASCII,' + unescape(encodeURIComponent(jsonPrompts)));
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
