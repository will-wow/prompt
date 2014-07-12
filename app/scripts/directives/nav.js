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
 