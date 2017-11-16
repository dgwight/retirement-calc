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
      "1", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "A"))
      .toEqual({annualPension: 66000})});

  it("Option A Group 2", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("March 14, 1940", "MMMM DD, YYYY"),  moment("April 4, 1960", "MMMM D, YYYY"), moment("February 17, 2010", "MMMM DD, YYYY"),
      "2", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "A"))
      .toEqual({annualPension: 62500})});

  it("Option A Group 4", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("May 22, 1950", "MMMM DD, YYYY"),  moment("June 4, 1970", "MMMM D, YYYY"), moment("July 17, 2010", "MMMM DD, YYYY"),
      "4", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "A"))
      .toEqual({annualPension: 50000})});

  it("Option B Group 1", function() {
    expect(CalculatorService.getAnnualPension(
      30000,
      moment("January 1, 1920", "MMMM D, YYYY"),  moment("January 1, 1930", "MMMM D, YYYY"), moment("January 1, 2018", "MMMM D, YYYY"),
      "1", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "B"))
      .toEqual({annualPension: 62700})});

  it("Option B Group 2", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("March 14, 1940", "MMMM DD, YYYY"),  moment("April 4, 1960", "MMMM D, YYYY"), moment("February 17, 2010", "MMMM DD, YYYY"),
      "1", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "B"))
      .toEqual({annualPension: 59375})});

  it("Option B Group 4", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("May 22, 1950", "MMMM DD, YYYY"),  moment("June 4, 1970", "MMMM D, YYYY"), moment("July 17, 2010", "MMMM DD, YYYY"),
      "4", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "B"))
      .toEqual({annualPension: 48500})});

  it("Option C Group 1", function() {
    expect(CalculatorService.getAnnualPension(
      30000,
      moment("January 1, 1920", "MMMM D, YYYY"),  moment("January 1, 1930", "MMMM D, YYYY"), moment("January 1, 2018", "MMMM D, YYYY"),
      "1", null,
      moment("January 1, 2005", "MMMM D, YYYY"),
      "C"))
      .toEqual({annualPension: 62040})});

  it("Option C Group 2", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("March 14, 1940", "MMMM DD, YYYY"),  moment("April 4, 1960", "MMMM D, YYYY"), moment("February 17, 2010", "MMMM DD, YYYY"),
      "1", null,
      moment("January 1, 2010", "MMMM D, YYYY"),
      "C"))
      .toEqual({annualPension: 58750})});

  it("Option C Group 4", function() {
    expect(CalculatorService.getAnnualPension(
      50000,
      moment("May 22, 1950", "MMMM DD, YYYY"),  moment("June 4, 1970", "MMMM D, YYYY"), moment("July 17, 2010", "MMMM DD, YYYY"),
      "4", null,
      moment("January 1, 2015", "MMMM D, YYYY"),
      "C"))
      .toEqual({annualPension: 43000})});
});
