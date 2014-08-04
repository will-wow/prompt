'use strict';

describe('Service: phonegapStatus', function () {

  // load the service's module
  beforeEach(module('promptApp'));

  // instantiate service
  var phonegapStatus;
  beforeEach(inject(function (_phonegapStatus_) {
    phonegapStatus = _phonegapStatus_;
  }));

  it('should do something', function () {
    expect(!!phonegapStatus).toBe(true);
  });

});
