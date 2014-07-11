'use strict';

describe('Directive: fullHeight', function () {

  // load the directive's module
  beforeEach(module('promptApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<full-height></full-height>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fullHeight directive');
  }));
});
