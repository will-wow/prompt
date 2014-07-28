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
                    scope.paused = false;
                };
            
            function scroll(time) {
                var top = 0,
                    currentTop  = scrollContainer.scrollTop(),
                    bottom      = (scrollBody.height() + 20) - scrollContainer.height(),
                    percentLeft = (bottom - (currentTop - top)) / bottom,
                    timeLeft    = Number(time) * percentLeft;
                    
                    if (bottom >= 0) {
                        scope.paused = false;
                        timeStart = Date.now();
                        
                        scrollContainer.scrollTop(bottom, timeLeft, function(t) {
                            return t;
                        })
                        .then(function () {
                            scope.paused = true;
                        });
                    } else {
                        scope.paused = true;
                    }
            }
            
            scope.paused = false;
            
            // Start the scroll from the begining, or the current scroll spot
            scope.play = function(time) {
                timeStart = Date.now() - timeElapsed;
                scroll(time);
            };
            
            // Pause the scrolling
            scope.pause = function() {
                scope.paused = true;
                
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
        },
        controllerAs: 'scroller'
    };
});
