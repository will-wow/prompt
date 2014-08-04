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
