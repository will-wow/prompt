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
  });
