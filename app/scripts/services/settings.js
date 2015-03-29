'use strict';

/**
 * @ngdoc service
 * @name promptApp.settings
 * @description
 * # settings
 * Holds settings options.
 */
angular.module('promptApp')
  .factory('settings', function () {
    var settings = {
      // Default font-size
      fontSize: 14
    };

    // Public API here
    return {
      get: function (setting) {
        return settings[setting];
      },
      update: function (setting, newValue) {
        settings[setting] = newValue;
      }
    };
  });
