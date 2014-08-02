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
    db.open(prompts);
    
    return api;
}]);
