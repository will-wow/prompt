'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:fullHeight
 * @description
 * # fullHeight
 */
angular.module('promptApp').directive('fullHeight', function() {
    return {
        restrict: 'A',
        controller: function($element, $window) {

            // Update scroll box height
            function updateHegiht() {
                var PADDING = 10,
                    FOOTER = 60,
                    height = $window.innerHeight - FOOTER - PADDING - ($element.offset().top);

                $element.height(height);
            }

            // Set scroll box height on open
            updateHegiht();

            // Update scroll box height on window resize
            angular.element($window).on('resize', updateHegiht);
        }
    };
});
