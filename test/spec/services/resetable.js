'use strict';

describe('Service: Resetable', function () {

  // load the service's module
  beforeEach(module('promptApp'));

  // instantiate service
  var Resetable;
  beforeEach(inject(function (_Resetable_) {
    Resetable = _Resetable_;
  }));

  it('should do something', function () {
    expect(!!Resetable).toBe(true);
  });

});
