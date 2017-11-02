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

            RetirementOption.A = RetirementOption("A");
            RetirementOption.B = RetirementOption("B");
            RetirementOption.C = RetirementOption("C");

            function calculateForOptionB(maxPension, retireAge_Years) {
                let percentOff;
                // TODO ask if this logic is what the client means.
                if (0 <= retireAge_Years && retireAge_Years < 50) {
                    percentOff = 0;
                } else if (50 <= retireAge_Years && retireAge_Years < 60) {
                    percentOff = 0.01;
                } else if (60 <= ageYear && ageYear < 70) {
                    percentOff = 0.03;
                } else {
                    percentOff = 0.05;
                }
                return maxPension * (1.0 - percentOff);
            }

            /**
             * Exposed function for calculating the annual pension.
             * 
             * highestAverageSalary: Float, highest average salary in dollars
             * yearsWorked: Integer, years worked before retirement
             * dateOfBirth: Date object, birth date
             * dateOfRetirement: Date object, retirement date
             * group: String, this employee's group
             * isVeteran: boolean, is employee a veteran?
             * 
             * hasBene: boolean, do you have a benefactor?
             * beneDoB: Date object, benefactor birthdate.
             *
             * option: RetirementOption object, what type of retirement plan
             */
            function getAnnualPension(highestAverageSalary, yearsWorked, dateOfBirth, dateOfRetirement, group, isVeteran,
                                        hasBene, beneDoB,
                                        option) {
                // TODO more validation.
                // TODO Check if age is less than 36, if so throw error.
                
                
                // Check if years is less than 10, if so return 0;
                if (yearsWorked === 0) {
                    return 0;
                }

                const maxAnnualPension = getMaxAnnualPension(highestAverageSalary, yearsWorked, dateOfBirth, dateOfRetirement, group, isVeteran);
                
                witch (option) {
                    case RetirementOption.A:
                        return maxAnnualPension;
                    case RetirementOption.B:
                        // TODO calculate year component in age
                        let retireAge_Years = dateOfRetirement - dateOfBirth;
                        return calculateForOptionB(maxAnnualPension, retireAge_Years);
                    case RetirementOption.C:
                        // TODO clarify algorithm.
                        return;
                }
            }
        });
})();
