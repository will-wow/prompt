'use strict';

/**
 * @ngdoc overview
 * @name promptApp
 * @description
 * # promptApp
 *
 * Main module of the application.
 */
angular
  .module('promptApp', [
    'ngRoute',
    'ngSanitize',
    'duScroll',
    'LocalStorageModule',
    'angularMoment',
    'angularFileUpload',
    'angularMSTime'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/prompts'
      })
      .when('/prompts', {
        templateUrl: 'views/all.html',
        controller: 'AllCtrl',
        controllerAs: 'all'
      })
      .when('/load', {
        templateUrl: 'views/load.html',
        controller: 'NewCtrl',
        controllerAs: 'new',
      }) 
      .when('/load/:promptId', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl',
        controllerAs: 'edit'
      })
      .when('/play', {
        templateUrl: 'views/play.html',
        controller: 'ChooseCtrl'
      })
      .when('/play/:promptId', {
        templateUrl: 'views/play.html',
        controller: 'PlayCtrl',
        controllerAs: 'play'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/raw', {
        templateUrl: 'views/raw.html',
        controller: 'RawCtrl',
        controllerAs: 'raw'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promptApp
 */
angular.module('promptApp').controller('MainCtrl', ['$scope', 'localStorageService', 'Prompts', function($scope, localStorageService, Prompts) {
    var scope = this;

    scope.prompts = Prompts;

    // Watch the prompts for change
    $scope.$watch(function() {
        return scope.prompts;
    }, function() {
        localStorageService.add('prompts', JSON.stringify(scope.prompts));
    }, true);
}]);

'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:LoadCtrl
 * @description
 * # LoadCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
// Add a prompt
.controller('NewCtrl', ['$location', 'Prompts', 'Prompt', function($location, Prompts, Prompt) {
    // Set up a Prompt class 
    var scope = this;

    // Tie a new prompt to the controller
    scope.prompt = new Prompt();
    
    // Add a new prompt by hand
    scope.addPrompt = function() {
        // Add prompt to db
        Prompts.push(scope.prompt);

        // Go to prompt's page (use the highest index from the prompts)
        $location.path('/load/' + (Prompts.length - 1));
    };
// Edit a Prompt
}]).controller('EditCtrl', ['$routeParams', '$location', 'Prompts', function($routeParams, $location, Prompts) {
    var scope = this,
        promptIndex = Number($routeParams.promptId);
    
    // Access the requested prompt
    scope.prompt = Prompts[promptIndex];
    
    // Remove the requested prompt
    scope.removePrompt = function () {
        Prompts.splice(promptIndex, 1);
        $location.path('/load');
    };
    // Move to the prompt's play page
    scope.playPrompt = function () {
        $location.path('/play/' + promptIndex);
    };
}]);
'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
.controller('PlayCtrl', ['$routeParams', '$location', 'Prompts', function($routeParams, $location, Prompts) {
    var scope = this,
        promptIndex = Number($routeParams.promptId);
    
    // Access the requested prompt
    scope.prompt = Prompts[promptIndex];
    
    scope.editPrompt = function () {
        $location.path('/load/' + promptIndex);
    };
}]);

 'use strict';

 /**
  * @ngdoc directive
  * @name promptApp.directive:nav
  * @description
  * # nav
  */
 angular.module('promptApp').directive('nav', function() {
     return {
         templateUrl: 'views/templates/nav.html',
         restrict: 'E',
         controller: function($element) {
            $element.on('click', '.navbar-collapse.in', function(e) {
                if (angular.element(e.target).is('a')) {
                    angular.element(this).collapse('hide');
                }
            });
         }
     };
 });
 
'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:foot
 * @description
 * # foot
 */
angular.module('promptApp')
  .directive('foot', function () {
    return {
      template: '<div class="footer">Fork me on <a href="http://github.com/whenther/prompt"><span class="fa fa-github"></span> Github</a></div>',
      restrict: 'E'
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name promptApp.Prompts
 * @description
 * # Prompts
 * Service in the promptApp.
 */
angular.module('promptApp')
.factory('Prompts', ['localStorageService', function(localStorageService) {
    var prompts = localStorageService.get('prompts') || [];
    return prompts;
}]);

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

'use strict';

/**
 * @ngdoc service
 * @name promptApp.Resettable
 * @description
 * # Resettable
 * Return a Class that has data and functions to make resetting data easy
 */
angular.module('promptApp').factory('Resettable', function Resettable() {
    // Pull in scope from calling controller
    return function (scope, model) {
        var master = {};
    
        scope.update = function() {
            master = angular.copy(model);
        };
    
        scope.reset = function() {
            model = angular.copy(master);
        };
    
        scope.isUnchanged = function() {
            return angular.equals(model, master);
        };
    
        scope.reset();
    };
});

'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:AllCtrl
 * @description
 * # AllCtrl
 * Controller of the promptApp
 */
angular.module('promptApp').controller('AllCtrl', ['$scope', '$location', '$upload', 'Prompts', 'Prompt', function($scope, $location, $upload, Prompts, Prompt) {
    var scope = this,
        readerOnLoad =  (function (i, fileCount, file, reader, prompt) {
            return function (e) {
                // Populate the prompt object
                prompt.name = file.name.replace(/\..+$/, '');
                prompt.body = reader.result;
                prompt.time = 0;
                
                // Add it to the Prompts array
                Prompts.push(prompt);
                
                // If this is the last file, note that in the scope
                if (i === fileCount-1) {
                    scope.uploadStatus = scope.uStats.DONE;
                    $scope.$apply();
                }
            };
        });
    
    // Status Types
    scope.uStats = {
        NONE:       0,
        STARTED:    1,
        DONE:       2
    };
    
    // current status
    scope.uploadStatus = scope.uStats.NONE;
    
    // Upload a prompt file
    scope.upload = function ($files) {
        var fileCount = $files.length;
        
        if (fileCount) {
            // Set status as started
            scope.uploadStatus = scope.uStats.STARTED;
        
            // Loop through uploaded files
            for (var i = 0; i < fileCount; i++) {
                var file = $files[i],
                    reader = new FileReader(),
                    prompt = new Prompt();
                
                // set up reader callback 
                reader.onload = readerOnLoad(i, fileCount, file, reader, prompt);
                // read in the file
                reader.readAsText(file);
            }
        }
    };
    
    // Move to the prompt's play page
    scope.play = function (promptIndex) {
        $location.path('/play/' + promptIndex);
    };
    // Move to the prompt's edit page
    scope.edit = function (promptIndex) {
        $location.path('/load/' + promptIndex);
    };
        // Remove the requested prompt
    scope.remove = function(promptIndex) {
        Prompts.splice(promptIndex, 1);
    };
    
    scope.clearAll = function () {
        Prompts.length = 0;
    };
}]);

'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:promptName
 * @description
 * # promptName
 */
angular.module('promptApp')
  .directive('promptName', function () {
    return {
      templateUrl: 'views/templates/promptname.html',
      restrict: 'E',
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name promptApp.prompt
 * @description
 * # prompt
 * Factory in the promptApp.
 */
angular.module('promptApp')
  .factory('Prompt', function () {
    
    // New-able Prompt model
    var Prompt = function () {
      this.name   = null;
      this.body   = null;
      this.notes  = null;
      this.time   = null;
      this.tags   = {};
    };
    
    Prompt.prototype.addTag = function (key, value) {
      if (key && value) {
        this.tags[key] = value;
      }
    };
    
    Prompt.prototype.removeTag = function (key) {
      delete this.tags[key];
    };
    
    return Prompt;
  });

'use strict';

/**
 * @ngdoc function
 * @name promptApp.controller:RawCtrl
 * @description
 * # RawCtrl
 * Controller of the promptApp
 */
angular.module('promptApp')
  .controller('RawCtrl', ['$scope', 'Prompts', function ($scope, Prompts) {
    var scope = this,
        prompts = Prompts;
    
    // Get JSON of current prompts
    scope.prompts = angular.toJson(prompts);
    
    // Overwrite
    scope.overwritePrompts = function () {
      // empty prompts
      prompts.length = 0;
      // replace contents
      Array.prototype.push.apply(prompts, angular.fromJson(scope.prompts || []));
      
      //$scope.$apply();
      // re-pull from prompts
      scope.prompts = angular.toJson(prompts);
    };
  }]);
