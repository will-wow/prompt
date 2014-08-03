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
    
    
    
    
