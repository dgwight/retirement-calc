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

  it("Option A Group 1", function() {
    expect(CalculatorService.getAnnualPension(
      30000,
      moment("January 1, 1920", "MMMM D, YYYY"),  moment("January 1, 1930", "MMMM D, YYYY"), moment("January 1, 2018", "MMMM D, YYYY"),
      "1", 10, false,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "A"))
      .toEqual({annualPension: 7500})});

  it("Option A Group 2", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("March 14, 1940", "MMMM DD, YYYY"),  moment("April 4, 1960", "MMMM D, YYYY"), moment("February 17, 2010", "MMMM DD, YYYY"),
      "2", 20, false,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "A"))
      .toEqual({annualPension: 25000})});

  it("Option A Group 4", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("May 22, 1950", "MMMM DD, YYYY"),  moment("June 4, 1970", "MMMM D, YYYY"), moment("July 17, 2010", "MMMM DD, YYYY"),
      "4", 20, false,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "A"))
      .toEqual({annualPension: 25000})});

  it("Option B Group 1", function() {
    expect(CalculatorService.getAnnualPension(
      30000,
      moment("January 1, 1920", "MMMM D, YYYY"),  moment("January 1, 1930", "MMMM D, YYYY"), moment("January 1, 2018", "MMMM D, YYYY"),
      "1", 10, false,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "B"))
      .toEqual({annualPension: 7125})});

  it("Option B Group 2", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("March 14, 1940", "MMMM DD, YYYY"),  moment("April 4, 1960", "MMMM D, YYYY"), moment("February 17, 2010", "MMMM DD, YYYY"),
      "1", 20, false,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "B"))
      .toEqual({annualPension: 23750})});

  it("Option B Group 4", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("May 22, 1950", "MMMM DD, YYYY"),  moment("June 4, 1970", "MMMM D, YYYY"), moment("July 17, 2010", "MMMM DD, YYYY"),
      "4", 20, false,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "B"))
      .toEqual({annualPension: 24250})});

  it("Option C Group 1", function() {
    expect(CalculatorService.getAnnualPension(
      30000,
      moment("January 1, 1920", "MMMM D, YYYY"),  moment("January 1, 1930", "MMMM D, YYYY"), moment("January 1, 2018", "MMMM D, YYYY"),
      "1", 10, false,
      moment("January 1, 2005", "MMMM D, YYYY"),
      "C"))
      .toEqual({annualPension: 2487})});

  it("Option C Group 2", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("March 14, 1940", "MMMM DD, YYYY"),  moment("April 4, 1960", "MMMM D, YYYY"), moment("February 17, 2010", "MMMM DD, YYYY"),
      "1", 20, false,
      moment("January 1, 2010", "MMMM D, YYYY"),
      "C"))
      .toEqual({annualPension: NaN})});

  it("Option C Group 4", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("May 22, 1950", "MMMM DD, YYYY"),  moment("June 4, 1970", "MMMM D, YYYY"), moment("July 17, 2010", "MMMM DD, YYYY"),
      "4", 20, false,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "C"))
      .toEqual({annualPension: NaN})});

  // TODO veteran tests
  // TODO tests without
});
