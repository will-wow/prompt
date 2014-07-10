'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:scrollable
 * @description
 * # scrollable
 */
angular.module('promptApp').directive('scrollable', function() {
    return {
        templateUrl: 'views/templates/scrollable.html',
        restrict: 'E',
        controller: function($window, $element) {
            var scope = this,
                timeStart = 0,
                timeElapsed = 0,
                scrollContainer = $element.find('#body-container'),
                scrollBody = $element.find('#body'),

                // Clear the timers
                clearTime = function() {
                    timeStart = 0;
                    timeElapsed = 0;
                };

            // Start the scroll from the begining, or the current scroll spot
            scope.play = function(time) {
                timeStart = Date.now() - timeElapsed;
                scrollContainer.scrollTop(scrollBody.height() - scrollContainer.height(), Number(time) - timeElapsed, function(t) {
                    return t;
                })
                // Reset the timers on finsih
                .then(clearTime);
            };
            
            // Pause the scrolling
            scope.pause = function() {
                scrollContainer.scrollTop(scrollContainer.scrollTop(), 1);
                if (timeStart)
                    timeElapsed = Date.now() - timeStart;
                else
                    timeElapsed = 0;
            };
            
            // Clear a pause, go to top
            scope.top = function() {
                clearTime();
                scrollContainer.scrollTop(0, 1);
            };
            
            // Clear a pause, and restart at top
            scope.restart = function(time) {
                clearTime();
                scrollContainer.scrollTop(0, 1)
                .then(scope.play(time));
            };
            
        },
        controllerAs: 'scroller'
    };
});
