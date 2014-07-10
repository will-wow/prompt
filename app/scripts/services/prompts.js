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
