'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:CalcCtrl
 * @description
 * # CalcCtrl
 * Controller of the testApp
 */
angular.module('testApp')
    .controller('CalcCtrl', ["$scope", function ($scope) {
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
                    scope.form.birthDateUnix = moment.unix(birthDate);

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
                    return {ok: true};
                }
            },
            {
                alias: "step3",
                title: "Step 3: Service Time Range",
                validate: function() {
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
            groupName: "Group 1",
            isVeteran: null,
            startDate: null,
            endDate: null,
            beneBirthDate: null,
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

        function moveForward() {
            if (scope.counter >= 0 && scope.counter < scope.max) {
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

    }]);
