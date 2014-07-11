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
                scrollBody = scrollContainer.find('#body'),

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
                });
                // Reset time elapsed immediatly, to show pause is done
                timeElapsed = 0;
            };
            
            // Pause the scrolling
            scope.pause = function() {
                scrollContainer.scrollTop(scrollContainer.scrollTop(), 1)
                .then(function () {
                    if (timeStart)
                        timeElapsed = Date.now() - timeStart;
                    else
                        timeElapsed = 0;
                });
                
            };
            // Clear a pause, go to top
            scope.top = function() {
                scrollContainer.scrollTop(0, 1)
                .then(clearTime);
            };
            
            // Return true if scrolling has started
            scope.scrollStarted = function () {
                // if started, not done
                return !!timeStart;
            };
            // return true if scrolling is pasued
            scope.scrollPaused = function () {
                return !!timeElapsed;
            };
        },
        controllerAs: 'scroller'
    };
});
