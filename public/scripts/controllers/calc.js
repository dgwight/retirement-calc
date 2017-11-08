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
                    const birthDate = moment(scope.form.birthDate, "MMMM D, YYYY");
                    const minBirthDate = moment().subtract(retireMinAge, 'years');
                    scope.form.birthDateMoment = birthDate;

                    if (birthDate.isAfter(minBirthDate)) {
                        return {
                            ok: false,
                            reason: "Sorry, your age entered is less than the minimum age of 36.\nPlease check the date or the Benefit Guide for more details."
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

                    if (startDateObj.isAfter(endDateObj)) {
                        return {
                            ok: false,
                            reason: "Sorry, you must be older than 36 to retire.\nPlease check the date or the Benefit Guide for more details."
                        };
                    }
                    return {ok: true};
                }
            },
            {
                alias: "step4",
                title: "Step 4: Highest Salary",
                validate: function() {
                    return {ok: true};
                }
            },
            {
                alias: "step5",
                title: "Step 5: Veteran Status",
                validate: function() {
                    return {ok: true};
                }
            },
            {
                alias: "step6",
                title: "Step 6: Beneficiary Information (Optional)",
                validate: function() {
                    if (!scope.form.beneBirthDate) {
                        return {ok: false, reason: "No end date specified!"};
                    }

                    const beneDateObj = moment(scope.form.beneBirthDate, "MMMM D, YYYY");
                    scope.form.beneBirthMoment = beneDateObj;
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

            isVeteran: null,
            veteranYears: null,

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

        function calcWithOption(optionStr) {
            let formData = scope.form;
            return CalculatorService.getAnnualPension(
                formData.highestAverageSalary,
                formData.birthDateMoment,
                formData.startDateMoment,
                formData.retireDateMoment,
                formData.groupNum,
                formData.veteranYears,
                formData.beneBirthMoment,
                optionStr);
        }

        function calculateOptions() {
            const result = {};
            result.optionA = calcWithOption("A");
            result.optionB = calcWithOption("B");
            if (scope.form.beneBirthDate) {
                result.optionC = calcWithOption("C");
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
                const results = calculateOptions();
                console.log(results);
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

        scope.showError = false;
        scope.topErrorMsg = "";
        function clearErrors() {
            scope.showError = false;
            scope.topErrorMsg = "";
        }

        scope.forward = function () {
            const validationResults = stepData[scope.counter].validate();
            if (validationResults.ok) {
                clearErrors();

                if (scope.counter === 0) {
                    $('#calc-header').animate({'opacity': 0.4}, 350, function() {});
                    $( "#calc-description").slideUp( "slow", function() {
                        $("#calc-description").hide();
                    });
                }

                transitionToNewTitle(moveForward);
            }  else {
                scope.showError = true;
                scope.topErrorMsg = validationResults.reason;
                console.log(validationResults.reason);
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

        scope.yearsAgoString = function (years, format) {
            const yearsAgoString = moment().subtract(years, 'years').format(format);
            console.log(yearsAgoString);
            return yearsAgoString;
        };
    }]);
