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
      controller: function ($element, $q, Prompts) {
        var scope = this;
        
        scope.isReady = false;
        
        // Ready a file for download
        function readyFile() {
          // Get the JSON for the prompts
          var jsonPrompts = angular.toJson(Prompts.list);
          
          // Make it into a data uri for the element
          $element.attr("href",'data:Application/octet-stream,'+encodeURIComponent(jsonPrompts));
          
          // Set the ready flag
          scope.isReady = true;
          
          console.log('ready');
        }
        
        $element.on('click', function () {
          console.log('Clicked Export!');
        });
        
        // Get the file ready for download on load
        readyFile();
      },
      controllerAs: 'export',
      replace: true
    };
  });
