'use strict';

describe('Test CalculatorService: ', function () {

  // load the controller's module
  beforeEach(module('testApp'));

  var MainCtrl, scope;
  var CalculatorService;


  // Initialize the controller and a mock scope
  beforeEach(inject(function (_CalculatorService_, $controller, $rootScope) {
    CalculatorService = _CalculatorService_;
    scope = $rootScope.$new();
    MainCtrl = $controller('CalcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it("Option A", function() {
    expect(CalculatorService.getAnnualPension(
      30000,
      moment("January 1, 1920", "MMMM D, YYYY"),  moment("January 1, 1930", "MMMM D, YYYY"), moment("January 1, 2018", "MMMM D, YYYY"),
      "1", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "A"))
      .toEqual({annualPension: 66000})});
});
