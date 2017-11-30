'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:CalcCtrl
 * @description
 * # CalcCtrl
 * Controller of the testApp
 */
angular.module('testApp')
    .controller('CalcCtrl', ["$scope", "CalculatorService", function ($scope, CalculatorService) {
        var scope = $scope;

        const retireMinAge = 36;
        const minAge = 18;

        let stepData = [
            {
                alias: "agree",
                title: "Usage Agreement",
                validate: function() {
                    return {ok: scope.agreed};
                }
            },
            {
                alias: "step1",
                title: "Step 1: Date of Birth",
                validate: function() {
                    if (!scope.form.birthDate) {
                        return {ok: false, reason: "No birth date specified!"};
                    }
                    const birthDateMoment = moment(scope.form.birthDate);
                    const minBirthDate = moment().subtract(minAge, 'years');
                    scope.form.birthDateMoment = birthDateMoment;

                    if (birthDateMoment.isAfter(minBirthDate)) {
                        return {
                            ok: false,
                            reason: "Sorry, your age entered is less than the minimum age of 18.\nPlease check the date or the Benefit Guide for more details."
                        };
                    }

                    return {ok: true};
                }
            },
            {
                alias: "step2",
                title: "Step 2: Employee Group Number",
                validate: function() {
                    switch (scope.form.groupName) {
                        case "Group 1":
                            scope.form.groupNum = "1";
                            break;
                        case "Group 2":
                            scope.form.groupNum = "2";
                            break;
                        case "Group 4":
                            scope.form.groupNum = "4";
                            break;
                        default:
                            return {okay: false, reason: "Invalid group number!"};
                    }
                    return {ok: true};
                }
            },
            {
                alias: "step3",
                title: "Step 3: Service Time Range",
                validate: function() {
                    if (!scope.form.startDate) {
                        return {ok: false, reason: "No start date specified!"};
                    }

                    if (!scope.form.endDate) {
                        return {ok: false, reason: "No end date specified!"};
                    }

                    const startDateObj = moment(scope.form.startDate, "MMMM D, YYYY");
                    scope.form.startDateMoment = startDateObj;

                    const endDateObj = moment(scope.form.endDate, "MMMM D, YYYY");
                    scope.form.retireDateMoment = endDateObj;
                    scope.oldCalc = startDateObj.isBefore(moment("4-2-2012", "MM-DD-YYYY"));

                    if (startDateObj.isAfter(endDateObj)) {
                        return {
                            ok: false,
                            reason: "Please enter an end date tbat is after the start date!"
                        };
                    }

                    if (calcYearsBetween(scope.form.birthDateMoment, endDateObj) <= retireMinAge) {
                      return {
                        ok: false,
                        reason: "Sorry, you must be at least 36 years old to retire.\nPlease check the date or the Benefit Guide for more details."
                      };
                    }
                    return {ok: true};
                }
            },
            {
                alias: "step4",
                title: "Step 4: Salary and Years Worked",
                validate: function() {
                    if (!scope.form.highestAverageSalary) {
                        return {ok: false, reason: "Please enter a valid salary!"};
                    }

                    if (!scope.form.yearsWorked) {
                        return {ok: false, reason: "Please enter the number of years you served!"};
                    }

                    return {ok: true};
                }
            },
            {
                alias: "results",
                title: "All set! Here are your estimates...",
                validate: function() {
                    return {ok: true};
                }
            }];

        scope.agreed = true;
        scope.form = {
            birthDate: null,
            birthDateMoment: null,

            groupName: "Group 1",
            groupNum: null,

            startDate: null,
            startDateMoment: null,
            endDate: null,
            retireDateMoment: null,

            highestAverageSalary: null,

            isVeteran: false,
            yearsWorked: null,

            beneBirthDate: null,
            beneBirthMoment: null,
        };

        scope.max = stepData.length - 1;
        scope.counter = 0;
        scope.step = stepData[scope.counter];
        scope.progress = 0;
        const progressStep = 100.0 / (stepData.length - 1);
        scope.stepTitle = stepData[0].title;


        function transitionToNewTitle(done) {
            $('#step-form').animate({'opacity': 0}, 350, function () {
                done();
            }).animate({'opacity': 1}, 350);
        }

        /**
         * Calculates the annual pension results for the given option.
         * @param optionStr
         * @returns {{annualPension}|*}
         * @throws error if calculation failed.
         */
        function calcWithOption(optionStr) {
            let formData = scope.form;
            return CalculatorService.getAnnualPension(
                formData.highestAverageSalary,
                formData.birthDateMoment,
                formData.startDateMoment,
                formData.retireDateMoment,
                formData.groupNum,
                formData.yearsWorked,
                formData.isVeteran,
                formData.beneBirthMoment,
                optionStr);
        }

        function calculateOptions() {
            const result = {};
            try {
              result.optionA = calcWithOption("A");
              result.optionB = calcWithOption("B");
              if (scope.form.beneBirthDate) {
                result.optionC = calcWithOption("C");
              }
            } catch (e) {
              setErrorForStep(scope.counter, e.message);
            }

            console.log(result);
            return result;
        }

        async function moveForward() {
            if (scope.counter >= 0 && scope.counter < (scope.max - 1)) {
                scope.counter += 1;
                scope.step = stepData[scope.counter];
                scope.progress += progressStep;
                scope.stepTitle = stepData[scope.counter].title;
                scope.$apply();
            } else if (scope.counter === (scope.max - 1)) {
                scope.results = calculateOptions();
                console.log(scope.results);
                scope.counter += 1;
                scope.step = stepData[scope.counter];
                scope.progress += progressStep;
                scope.stepTitle = stepData[scope.counter].title;
                scope.$apply();
            }
        }

        function moveBackward() {
            if (scope.counter >= 1) {
                scope.counter -= 1;
                scope.step = stepData[scope.counter];
                scope.progress -= progressStep;
                scope.stepTitle = stepData[scope.counter].title;
                scope.$apply();
            }
        }

        scope.errors = {}
        scope.showError = function(stepNum) {
            if (scope.errors.hasOwnProperty(stepNum)) {
              return scope.errors[stepNum];
            }
            return null;
        }

        function clearErrorForStep(stepNum) {
            if (scope.errors.hasOwnProperty(stepNum)) {
              delete scope.errors[stepNum];
            }
        }

        function setErrorForStep(stepNum, reason) {
          scope.errors[stepNum] = reason;
          console.log(reason);
        }

        scope.forward = function () {
            const validationResults = stepData[scope.counter].validate();
            if (validationResults.ok) {
                clearErrorForStep(scope.counter);

                if (scope.counter === 0) {
                    $('#calc-header').animate({'opacity': 0.4}, 350, function() {});
                    $( "#calc-description").slideUp( "slow", function() {
                        $("#calc-description").hide();
                    });
                }

                transitionToNewTitle(moveForward);
            }  else {
                setErrorForStep(scope.counter, validationResults.reason);
            }
        };

        scope.backward = function () {
            if (scope.counter === 1) {
                $('#calc-header').animate({'opacity': 1}, 350, function() {});
                $( "#calc-description").slideDown( "slow", function() {
                    $("#calc-description").show();
                });
            }
            transitionToNewTitle(moveBackward);
        };

      /**
       * Calculates the rounded amount of years between two Moment timstamps
       * @param MomentStart in seconds
       * @param MomentEnd in seconds
       * @returns {number}
       */
      function calcYearsBetween(MomentStart, MomentEnd) {
        return Math.round(MomentEnd.diff(MomentStart, 'years', true));
      }

        scope.yearsAgoString = function (years, format) {
            return moment().subtract(years, 'years').format(format);
        };

        scope.createCalculation = function () {
            let formData = scope.form;

            var calculation = {
                highestAverageSalary : formData.highestAverageSalary,
                birthMoment          : formData.birthDateMoment,
                startMoment          : formData.startDateMoment,
                retireMoment         : formData.retireDateMoment,
                groupNum             : formData.groupNum,
                yearsWorked          : formData.yearsWorked,
                isVeteran            : formData.isVeteran,
                beneBirthMoment      : formData.beneBirthMoment
            };

            console.log(calculation);

            CalculatorService
                .createCalculation(calculation)
                .then(function(calculationId) {
                    console.log(calculationId);
                    var baseLink = location.host + "/calculation/";
                    scope.saveLink = baseLink + calculationId.data;
                });
        };

    }]);
