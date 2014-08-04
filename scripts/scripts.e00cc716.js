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
    'angularFileUpload',
    'angularMSTime'
  ])
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
angular.module('promptApp').controller('MainCtrl', ['Prompts', function(Prompts) {
    var scope = this;
    
    // make all prompts available
    scope.prompts = Prompts.list;
    // make the ready() function available
    // app should disable prompt access until ready
    scope.ready = Prompts.ready;
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
        Prompts.add(scope.prompt)
        .then(function () {
            // Go to prompt's page (use the returned index)
            $location.path('/load/' + (Prompts.list.length - 1));
        });
        // TODO: notify on error
    };
// Edit a Prompt
}]).controller('EditCtrl', ['$routeParams', '$location', '$scope', '$q', 'Prompts', function($routeParams, $location, $scope, $q, Prompts) {
    var scope = this,
        promptIndex = Number($routeParams.promptId);
    
    scope.prompt = {};
    
    function localCopyPrompt () {
        // Get a local copy of the requested prompt
        // Using JSON seems to be the fastest way to do this
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
        scope.prompt = JSON.parse(JSON.stringify(Prompts.list[promptIndex]));
    }
    
    // Pull a local copy on load
    localCopyPrompt();
    
    // Push any changes to DB and persist
    scope.updatePrompt = function () {
        Prompts.update(scope.prompt)
        .then(function () {
            // Pull a new copy, just in case something weird happened
            localCopyPrompt();
        });
    };
    // Remove the requested prompt
    scope.removePrompt = function () {
        var deferred = $q.defer();
        
        $scope.$emit('areYouSure', {
          action  : 'delete ' + scope.prompt.name,
          body    : 'This cannot be undone!',
          deferred: deferred
        });
        
        deferred.promise.then(function () {
            Prompts.delete(scope.prompt._id)
            // Move to the all page
            .then(function () {
                $location.path('/all');
            });
        });
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
    scope.prompt = Prompts.list[promptIndex];
    
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
.factory('Prompts', ['db', function (db) {
    // init the prompts array
    var prompts = [],
    // Set up the public API
    // Keep it here, so it can be passed to the DB service
        api = {
            // returns true if db is ready
            ready: db.ready,
            list: prompts,
            // Physically replace this list
            replaceList: function (newPrompts) {
                // empty the prompts
                prompts.length = 0;
                // repopulate prompts with new prompts
                Array.prototype.push.apply(prompts, newPrompts);
            },
            // use the DB functions to do CRUD operations through the db
            // They will populate back here
            replace : db.replace,
            add     : db.add,
            update  : db.update,
            delete  : db.delete,
            clear   : db.clear
        };
    
    // Open the DB (which will populate prompts)
    db.open(prompts).then(function () {});
    
    return api;
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
angular.module('promptApp').controller('AllCtrl', ['$scope', '$location', '$upload', '$q', 'Prompts', 'Prompt', function($scope, $location, $upload, $q, Prompts, Prompt) {
    var scope = this,
        readerOnLoad = (function (i, fileCount, file, reader, prompt) {
            return function (e) {
                // Populate the prompt object
                prompt.name = file.name.replace(/\..+$/, '');
                prompt.body = reader.result;
                prompt.time = 0;
                
                // Add it to the Prompts array
                Prompts.add(prompt)
                .then(function (e) {
                    // If this is the last file, note that in the scope
                    if (i === fileCount-1) {
                        scope.uploadStatus = scope.uStats.DONE;
                        //$scope.$apply();
                    } 
                });
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
    scope.remove = function(promptIndex, promptID) {
        var deferred = $q.defer();
        
        $scope.$emit('areYouSure', {
            action  : 'delete ' + Prompts.list[promptIndex],
            body    : 'This cannot be undone!',
            deferred: deferred
        });
        
        deferred.promise.then(function () {
            Prompts.delete(promptID)
            // A blank function seems to get the scope to update
            .then(function () {});
        });
    };
    
    scope.clearAll = function () {
        var deferred = $q.defer();
        
        $scope.$emit('areYouSure', {
            action  : 'clear all data',
            body    : 'This cannot be undone!',
            deferred: deferred
        });
        
        deferred.promise.then(function () {
            Prompts.clear()
            // A blank function seems to get the scope to update
            .then(function () {});
        });
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
  .controller('RawCtrl', [function () {
    var scope = this;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name promptApp.db
 * @description
 * # db
 * Factory in the promptApp.
 */
angular.module('promptApp')
  .factory('db', ['$q', '$rootScope', function ($q, $rootScope) {
    
    // Hold ref to the Prompts list
    var Prompts,
    // Hold ref to the db
        db,
    // db ready flag
        ready = false,
        DB_NAME = 'prompt',
        PROMPTS_STORE_NAME = 'prompts';
    
    function onError(deferred, message) {
      console.log(message || 'There was an error with the db');
      deferred.reject();
    }
    
    /**
     * return a reference to an objectStore
     * @param {string} store_name
     * @param {string} mode either "readonly" or "readwrite"
     */
    function getObjectStore(store_name, mode) {
      return db.transaction(store_name, mode).objectStore(store_name);
    }
    
    /**
     * Update the scope with the prompts
     * @param {string} store_name
     * @param {string} mode either "readonly" or "readwrite"
     */
    function promptsToScope (deferred, data) {
      // Get the prompts objectStore
      var store = getObjectStore(PROMPTS_STORE_NAME, 'readonly');
      
      // Clear the Prompts service's list
      Prompts.length = 0;
      
      // open a cursor to run through the prompts
      store.openCursor().onsuccess = function(evt) {
        // Set up the cursor
        var cursor = evt.target.result;
        
        // Check if there are is another prompt in the db
        if (cursor) {
           // If there are more entries, continue
          
          // Add the prompt to the Prompts service list
          // Set it to the cursor key to keep things in sync
          Prompts.push(cursor.value);
          
          // Move on to the next object in store
          cursor.continue();
        } else {
          deferred.resolve(data);
        }
      };
    }
    
    return {
      //========================================================================
      // READY =================================================================
      //========================================================================
      // Flag for db readiness
      // should be used with an ng-show or ng-enable
      ready: function () {
        return ready;
      },
      
      //========================================================================
      // OPEN ==================================================================
      //========================================================================
      open: function(promptsService) {
        var deferred = $q.defer(),
            version = 2,
            reqOpen = indexedDB.open(DB_NAME, version);
        
        // Get a reference to the promptsService
        Prompts = promptsService;
        
        // Create the prompts objectStore (only happens the first time)
        reqOpen.onupgradeneeded = function(e) {
          var db = e.target.result;
      
          // ERROR HANDLING
          e.target.transaction.onerror = function () {
            alert('There was an error creating the DB.');
          };
          
          // Clear old version of DB
          if(db.objectStoreNames.contains(PROMPTS_STORE_NAME)) {
            db.deleteObjectStore(PROMPTS_STORE_NAME);
          }
          
          // Create the prompts objectStore
          db.createObjectStore(PROMPTS_STORE_NAME, {keyPath: '_id', autoIncrement: true});
        };
        
        // Fires after db is ready
        reqOpen.onsuccess = function(e) {
          db = e.target.result;
          
          // set readiness
          ready = true;
          // Push any prompts from the db to the Prompts service
          // which will go to any scope that needs them
          promptsToScope(deferred);
        };
      
        // Errors usually caused by old browsers or high security
        reqOpen.onerror = function () {
          onError(deferred, 'DB not opened!');
        };
        
        return deferred.promise;
      },
      //========================================================================
      // OPEN ==================================================================
      //========================================================================
      add: function (prompt) {
        // Get the store
        var deferred = $q.defer(),
            store = getObjectStore(PROMPTS_STORE_NAME, 'readwrite');
        
        // Add the prompt
        store.add(prompt);
        // Update the scope
        store.transaction.oncomplete = function(e) {
          // Include new index to be send with the resolve
          promptsToScope(deferred);
        };
        store.transaction.onerror = function (e) {
          onError(deferred, "Couldn't add " + prompt.name);
        };
        
        return deferred.promise;
      },
      //========================================================================
      // DELETE ================================================================
      //========================================================================
      delete: function (index) {
        // Get the store
        var deferred = $q.defer(),
            store = getObjectStore(PROMPTS_STORE_NAME, 'readwrite');
        
        // Delete the prompt
        store.delete(index);

        // Update the scope on delete
        store.transaction.oncomplete = function(e) {
          promptsToScope(deferred);
        };
        store.transaction.onerror = function (e) {
          onError(deferred, "Couldn't delete " + index);
        };
        
        return deferred.promise;
      },
      //========================================================================
      // UPDATE ================================================================
      //========================================================================
      update: function (prompt) {
        // Save a ref to the store for a later put
        var deferred = $q.defer(),
            store = getObjectStore(PROMPTS_STORE_NAME, 'readwrite'),
            index = prompt._id;
        
        // Find the prompt
        store.get(index)
        // Update the prompt
        .onsuccess = function(e) {
          // Get the old data
          var record = e.target.result;
          
          // Check that the entry exists
          if (typeof record == 'undefined') {
            console.log("No matching record found");
            return;
          }
          
          // Update the entry
          store.put(prompt);
          // Error
          store.transaction.onerror = function(e) {
            onError(deferred, "Couldn't update " + index);
          };
          // Update the scope on update
          store.transaction.oncomplete = function(e) {
            promptsToScope(deferred);
          };
        };
        
        return deferred.promise;
      },
      //========================================================================
      // CLEAR =================================================================
      //========================================================================
      clear: function () {
        var deferred = $q.defer(),
            store = getObjectStore(PROMPTS_STORE_NAME, 'readwrite');
        
        store.clear();
            
        // Update to the new cleared scope on successful clear
        store.transaction.oncomplete = function () {
          promptsToScope(deferred);
        };
        // error
        store.transaction.onerror = function (e) {
          onError(deferred, "Couldn't clear");
        };
        
        return deferred.promise;
      },
      //========================================================================
      // REPLACE ===============================================================
      //========================================================================
      replace: function (prompts) {
        var deferred = $q.defer(),
            store = getObjectStore(PROMPTS_STORE_NAME, 'readwrite');
        
        // Clear the store
        store.clear()
        // When clear is done (as part of same transaction)
        // Load in the new data
        .onsuccess = function () {
          for (var i=0; i<prompts.length; i++) {
            // Add the new prompt
            store.add(prompts[i]);
          }
          
        };
        
        // When full transaction is complete
        // Push the new data to scope
        store.transaction.oncomplete = function () {
          promptsToScope(deferred);
        };
        
        return deferred.promise;
      }
    }; 
  }]);
    
    
    
    

'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:modal
 * @description
 * # modal
 */
angular.module('promptApp')
  .directive('modal', function () {
    return {
      templateUrl: 'views/templates/modal.html',
      restrict: 'E',
      controller: function ($scope, $element) {
        var scope = this;
        
        //======================================================================
        // FUNCTIONS ===========================================================
        //======================================================================
        // Clear the scope variables
        function clearScope() {
          scope.title = '';
          scope.body = '';
          scope.buttons.length = 0;
        }
        
        // Close the modal
        function closeModal () {
          // Hide the modal
          // This will trigger a clearscope when done
          $element.modal('hide');
        }
        
        // Open the model with new data
        function openModal(data) {
          // Clear old scope
          clearScope();
          
          // Set up scope
          scope.title = data.title;
          scope.body = data.body;
          
          // Add buttons
          for (var i=0; i<data.buttons.length; i++) {
            // Create closure for each button
            (function () {
              // Save ref to button
            var dataBtn   = data.buttons[i];
            // Build new button to add to scope
            var scopeBtn  = {};
            
            // Add text
            scopeBtn.text = dataBtn.text;
            
            // Add class name(s)
            scopeBtn.class = function () {
              return dataBtn.class;
            };
            
            // Add click handler
            if (dataBtn.click) {
              
              // If click handler included
              scopeBtn.click = function (e) {
                dataBtn.click(e);
                // Add close if requested
                if (dataBtn.close) {
                  closeModal();
                }
              };
            } else if (dataBtn.close) {
              
              // Only add close, only if requested
              scopeBtn.click = closeModal;
            }
            
            // Add the new button to the scope
            scope.buttons.push(scopeBtn);
            })();
          }
          
          // Open modal
          $element.modal();
        }
        
        // Open the modal with Are You Sure defaults
        function openAreYouSure(data) {
          var modalData = {};
          
          modalData = {
            title   : "Are you sure you want to " + data.action + "?",
            body    : data.body,
            buttons : [
              // Continue with action button
              {
                text  : '<i class="fa fa-check"></i> Yes',
                click : function (e) {
                  data.deferred.resolve();
                },
                close : true,
                class : "btn-success"
              },
              // Cancel action button
              {
                text: '<i class="fa fa-times"></i> No',
                click: function (e) {
                  data.deferred.reject();
                },
                close : true,
                class : "btn-danger"
              }
            ]
          };
          
          // Open the modal
          openModal(modalData);
        }
        
        //======================================================================
        // EVENTS ==============================================================
        //======================================================================
        // Bring up a generic modal
        $scope.$on('modal', function (e, data) {
          openModal(data);
        });
        
        // Bring up an are-you-sure modal
        $scope.$on('areYouSure', function (e, data) {
          openAreYouSure(data);
        });
        
        // Clear the scope when the modal is finished closing
        $element.on('hidden.bs.modal', function (e) {
          clearScope();
        });
        
        //======================================================================
        // SCOPE ===============================================================
        //======================================================================
        // Title
        scope.title = '';
        // Body
        scope.body = '';
        // Buttons
        scope.buttons = [];
        
      },
      controllerAs: 'modal',
      replace: true
    };
  });

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

'use strict';

/**
 * @ngdoc directive
 * @name promptApp.directive:importBtn
 * @description
 * # importBtn
 */
angular.module('promptApp')
  .directive('importBtn', function () {
    return {
      template: '<label class="btn btn-danger"><i class="fa fa-upload"></i> Import\
                    <input type="file" ng-file-select="import.upload($files)" style="display:none;"></input>\
                </label>',
      restrict: 'E',
      controller: function ($element, $q, $scope, $location, Prompts) {
        var scope = this;
        
        // Ready a file for download
        scope.upload = function (files) {
          if (files) {
            // Are you sure
            var deferred = $q.defer();
    
            $scope.$emit('areYouSure', {
              action  : 'overwrite all data',
              body    : 'This cannot be undone!',
              deferred: deferred
            });
            
            // If yes 
            deferred.promise.then(function () {
              // set up reader
              var reader = new FileReader();
          
              // set up reader callback 
              // this will run after the file is parsed
              reader.onload = function (e) {
                // Replace the prompts with the file's info
                Prompts.replace(angular.fromJson(reader.result) || [])
                // Move to the prompts page
                .then(function () {
                  $location.path('/');
                });
              };
              
              // read in the file
              reader.readAsText(files[0]);
            });
          }
        };
        
      },
      controllerAs: 'import',
      replace: true
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name promptApp.phonegapStatus
 * @description
 * # phonegapStatus
 * Factory in the promptApp.
 */
angular.module('promptApp')
  .factory('phonegapStatus', ['$q', function ($q) {
    var deferred = $q.defer();
    
    // Return true if phonegap is running
    function isPhoneGap() {
     return !!window.PhoneGap;
    }
    
    // resolve the deferred promise if phonegap exists, when ready
    function onPhoneGapReady() {
      deferred.resolve();
    }
    
    // check if phonegap is installed
    if (isPhoneGap()) {
      console.log('PhoneGap ready!');
      
      // Add listener for deviceready
      // And resolve the promise when it is ready
      document.addEventListener("deviceready", onPhoneGapReady, false);
    } else {
      console.log('Non-PhoneGap browser ready!');
      
      // Reject the promise if this isn't a phonegap instance
      deferred.reject();
    }
    
    
    // Retun the promise
    return deferred.promise;
  }]);
