'use strict';

describe('Service: Prompts', function () {

  // load the service's module
  beforeEach(module('promptApp'));

  // instantiate service
  var Prompts;
  beforeEach(inject(function (_Prompts_) {
    Prompts = _Prompts_;
  }));

  it('should do something', function () {
    expect(!!Prompts).toBe(true);
  });

});
