'use strict';

describe('Service: prompt', function () {

  // load the service's module
  beforeEach(module('promptApp'));

  // instantiate service
  var prompt;
  beforeEach(inject(function (_prompt_) {
    prompt = _prompt_;
  }));

  it('should do something', function () {
    expect(!!prompt).toBe(true);
  });

});
