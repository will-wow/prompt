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
                notesContainer = $element.find('#notes-container'),
                scrollBody = scrollContainer.find('#body'),
                keepAwakeVideo = $element.find('#keep-awake-video').get(0),

                // Clear the timers
                clearTime = function() {
                    timeStart = 0;
                    scope.paused = false;
                },
                sleepPreventer = {
                    start: function () {
                        keepAwakeVideo.play();
                        // Loop, if the loop tag doesnt work
                        // Shouldn't do anything otherwise
                        keepAwakeVideo.addEventListener('ended', function (e) {
                            keepAwakeVideo.play();
                        });
                    },
                    stop: function () {
                        keepAwakeVideo.pause();
                    }
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
                            sleepPreventer.stop();
                            scope.paused = true;
                        });
                    } else {
                        sleepPreventer.stop();
                        scope.paused = true;
                    }
            }
            
            scope.paused = false;
            
            // Start the scroll from the begining, or the current scroll spot
            scope.play = function(time) {
                timeStart = Date.now() - timeElapsed;
                scroll(time);
                sleepPreventer.start();
            };
            
            // Pause the scrolling
            scope.pause = function(cb) {
                scope.paused = true;
                
                scrollContainer.scrollTop(scrollContainer.scrollTop(), 1)
                .then(function () {
                    if (timeStart)
                        timeElapsed = Date.now() - timeStart;
                    else
                        timeElapsed = 0;
                    
                    sleepPreventer.stop();
                    
                    // Run the callback
                    if (cb) cb();
                });
                
            };
            
            scope.pauseToggle = function (time) {
                if (scope.paused)
                    scope.pause();
                else 
                    scope.play(time);
            };
            
            // Clear a pause, go to top
            scope.top = function() {
                scrollContainer.scrollTop(0, 1)
                .then(clearTime);
                sleepPreventer.stop();
            };
            
            // Return true if scrolling has started
            scope.scrollStarted = function () {
                // if started, not done
                return !!timeStart;
            };
            
            // Toggle the notes section
            scope.notesToggle = function (time) {
                // Toggle the open/closed classes
                notesContainer.toggleClass('open');
                scrollContainer.toggleClass('half');
                
                // Pause & restart scrolling
                // This will update the scroll speed & target for the new
                // body length
                if (scope.scrollStarted()) {
                    scope.pause(function () {
                       scope.play(time); 
                    });
                }
            };
        },
        controllerAs: 'scroller'
    };
});
