'use strict';

/**
 * @ngdoc service
 * @name promptApp.Resetable
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
