'use strict';

/**
 * @description
 * # ResultCtrl
 */
angular.module('testApp')
    .controller('ResultCtrl', ["$scope", "$location", "$routeParams", "ResultService", "CalculatorService", function ($scope, $location, $routeParams, ResultService, CalculatorService) {
        var scope = $scope;
        
        const resultId = $routeParams['resultId'];
        
        ResultService.getResult(resultId)
            .then(function (result) {
                scope.result = result;
                scope.results = calculateOptions();
            }, function () {
                $location.path("/");
            });

      /**
         * Calculates the annual pension results for the given option.
         * @param optionStr
         * @returns {{annualPension}|*}
         * @throws error if calculation failed.
         */
        function calcWithOption(optionStr) {
            let formData = scope.result;
            console.log(formData);
            return CalculatorService.getAnnualPension(
                formData.highestAverageSalary,
                moment(formData.birthMoment),
                moment(formData.startMoment),
                moment(formData.retireMoment),
                formData.groupNum,
                formData.yearsWorked,
                formData.isVeteran,
                moment(formData.beneBirthMoment),
                optionStr);
        }

        function calculateOptions() {
            const result = {};
            try {
              result.optionA = calcWithOption("A");
              result.optionB = calcWithOption("B");
              if (scope.result.beneBirthMoment) {
                result.optionC = calcWithOption("C");
              }
            } catch (e) {
                console.log(e);
            //   setErrorForStep(scope.counter, e.message);
            }
            console.log(result);

            return result;
        }            
    }]);
