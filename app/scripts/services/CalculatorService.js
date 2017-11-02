'use strict';

(function () {
    angular
        .module("testApp")
        .factory("CalculatorService", function () {

            return {
                "getAnnualPension": getAnnualPension
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
                const ageFactor = getAgeFactor(dateOfBirth, dateOfRetirement, group);
                const baseMaxAnnualPension = ageFactor * years * highestAverageSalary;
                if (isVeteran) {
                    return years > 20 ? baseMaxAnnualPension + years * 15 : baseMaxAnnualPension + 300;
                } else {
                    return baseMaxAnnualPension;
                }
            }
            
            /**
             * Represents an enumeration for all retirement plan options.
             */
            class RetirementOption {
                constructor(name) {
                    this.name = name;
                }

                toString() {
                    return `RetirementOption.${this.name}`;
                }
            }

            /**
             * Used for calculating pension for Option B
             * @param maxPension
             * @param retireAge_Years
             * @returns {number}
             */
            function calculateForOptionB(maxPension, retireAge_Years) {
                let percentOff;
                // TODO ask if this logic is what the client means.
                if (0 <= retireAge_Years && retireAge_Years < 50) {
                    percentOff = 0;
                } else if (50 <= retireAge_Years && retireAge_Years < 60) {
                    percentOff = 0.01;
                } else if (60 <= retireAge_Years && retireAge_Years < 70) {
                    percentOff = 0.03;
                } else {
                    percentOff = 0.05;
                }
                return maxPension * (1.0 - percentOff);
            }

            /**
             * Exposed function for calculating the annual pension.
             *
             * @param highestAverageSalary Float, highest average salary in dollars
             * @param yearsWorked Integer, years worked before retirement
             * @param dateOfBirth Date object, birth date
             * @param dateOfRetirement Date object, retirement date
             * @param group String, this employee's group
             * @param isVeteran boolean, is employee a veteran?
             * @param hasBene boolean, do you have a benefactor?
             * @param beneDoB Date object, benefactor birthdate.
             * @param option String, what type of retirement plan
             * @returns {*}
             */
            function getAnnualPension(highestAverageSalary, yearsWorked,
                                      dateOfBirth, dateOfRetirement,
                                      group, isVeteran,
                                      hasBene, beneDoB,
                                      option) {

                RetirementOption.A = new RetirementOption("A");
                RetirementOption.B = new RetirementOption("B");
                RetirementOption.C = new RetirementOption("C");

                // TODO more validation.
                const retireAge_Years = Math.round(
                    (dateOfRetirement.getTime() - dateOfBirth.getTime()) / (1000 * 3600 * 24 * 365));

                // Check if retirement age is okay
                if (retireAge_Years < 36) {
                    return 0;
                }

                // Check if years worked is okay
                if (yearsWorked <= 10) {
                    return 0;
                }

                const maxAnnualPension = getMaxAnnualPension(highestAverageSalary, yearsWorked,
                                                                dateOfBirth, dateOfRetirement, group, isVeteran);
                
                switch (option) {
                    case RetirementOption.A.name:
                        return {"annualPension": maxAnnualPension, "beneAnnualPension": 0};
                    case RetirementOption.B.name:
                        return {"annualPension": calculateForOptionB(maxAnnualPension, retireAge_Years), "beneAnnualPension": 0};
                    case RetirementOption.C.name:
                        // TODO Implement this: need to clarify calculation method.
                        return {"annualPension": 0, "beneAnnualPension": 0};
                }
            }
        });
})();
