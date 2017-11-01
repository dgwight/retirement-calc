'use strict';

(function () {
    angular
        .module("testApp")
        .factory("CalculatorService", function () {

            return {
                "open": open
            };


            // Age factor * Years of Creditable Service * Highest 5 year average of annual pay = Option A annual allowance
            //
            // If a veteran, add $15 for every year served (partial years included) in either calculation. Maximum of $300.
            //
            //
            //
            //     If option B, reduce pension amount using above chart.
            //     50 = 1%
            //     60 = 3%
            //     70 = 5%
            //     If option C, reduce pension amount using above chart.
        //

            function getWeightedRetirementAge(dateOfBirth, dateOfRetirement, group) {
                const age = dateOfBirth - dateOfRetirement;
                switch (group) {
                    case "1":
                        return age;
                    case "2":
                        return age + 5.0;
                    case "4":
                        return age + 10.0;
                    default:
                        return age;
                }
            }

            function getAgeFactor(dateOfBirth, dateOfRetirement, group) {
                const weightedAge = getWeightedRetirementAge(dateOfBirth, dateOfRetirement, group);

                if (weightedAge >= 67) {
                    return 2.5;
                } else if (weightedAge >= 60) {
                    return (0.125 * weightedAge ) - 5.875;
                } else {
                    return 0;
                }
            }

            function getMaxAnnualPension (highestAverageSalary, years, dateOfBirth, dateOfRetirement, group, isVeteran) {

                //TODO: veteran adds $15 per year up to 300

                const ageFactor = getAgeFactor(dateOfBirth, dateOfRetirement, group);
                const baseMaxAnnualPension = ageFactor * years * highestAverageSalary;
                if (isVeteran) {
                    return baseMaxAnnualPension + years * 15
                } else {
                    return baseMaxAnnualPension
                }

                return getAgeFactor(dateOfBirth, dateOfRetirement, group) ;
            }
            
            function getAnnualPension(maxAnnualPension, option) {
                
            }

        });
})();
