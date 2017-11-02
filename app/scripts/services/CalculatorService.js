'use strict';

(function () {
    angular
        .module("testApp")
        .factory("CalculatorService", function () {
            initEnums();
            return {
                "getAnnualPension": getAnnualPension
            };

            function initEnums() {
                RetirementOption.A = new RetirementOption("A");
                RetirementOption.B = new RetirementOption("B");
                RetirementOption.C = new RetirementOption("C");

                EmployeeGroup.ONE = new EmployeeGroup("1");
                EmployeeGroup.TWO = new EmployeeGroup("2");
                EmployeeGroup.FOUR = new EmployeeGroup("4");
            }

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
             * Represents an enumeration for all retirement plan options.
             */
            class EmployeeGroup {
                constructor(name) {
                    this.name = name;
                }

                toString() {
                    return `EmployeeGroup.${this.name}`;
                }
            }


            /**
             * Used for calculating pension for Option B
             * @param maxPension
             * @param retireAge_Years
             * @returns {number}
             */
            function calcOptionB(maxPension, retireAge_Years) {
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
             * Based on the starting date of employment, retirement age, years worked, and option, determine if
             * you are eligible for retirement.
             *
             * @param dateOfStartEmployment Date object, date of start employment
             * @param retirementAge_Years   number, age of retirement in years
             * @param yearsWorked           number, number of years worked
             * @param employeeGroup         EmployeeGroup, what type of employee are you considered as
             * @returns {boolean}
             */
            function isEligibleForRetirement(dateOfStartEmployment, retirementAge_Years, yearsWorked, employeeGroup) {
                let secondPolicyDate = new Date("4/2/2012");
                let isFirstPolicy = secondPolicyDate < dateOfStartEmployment;
                if (isFirstPolicy) {
                    if (yearsWorked >= 20) {
                        return true;
                    } else {
                        return yearsWorked >= 10 && retirementAge_Years >= 55;
                    }
                } else {
                    if (yearsWorked < 10) {
                        return false
                    }
                    switch (employeeGroup) {
                        case EmployeeGroup.ONE:
                            return retirementAge_Years >= 60;
                        case EmployeeGroup.TWO:
                            return retirementAge_Years >= 55;
                        case EmployeeGroup.FOUR:
                            return retirementAge_Years >= 50;
                        default:
                            throw Error("Invalid EmployeeGroup option: " + employeeGroup);
                    }
                }
            }

            function convertOptionToEnum(option) {
                switch (option) {
                    case RetirementOption.A.name:
                        return RetirementOption.A;
                    case RetirementOption.B.name:
                        return RetirementOption.B;
                    case RetirementOption.C.name:
                        return RetirementOption.C;
                    default:
                        throw new Error("Unknown retirement option: " + option);
                }
            }

            function convertGroupToEnum(group) {
                switch (group) {
                    case EmployeeGroup.ONE.name:
                        return EmployeeGroup.ONE;
                    case EmployeeGroup.TWO.name:
                        return EmployeeGroup.TWO;
                    case EmployeeGroup.FOUR.name:
                        return EmployeeGroup.FOUR;
                    default:
                        throw new Error("Unknown employee group: " + group)
                }
            }

            /**
             * Exposed function for calculating the annual pension.
             *
             * @param highestAverageSalary Float, highest average salary in dollars
             * @param yearsWorked          Integer, years worked before retirement
             * @param dateOfBirth          Date object, birth date
             * @param dateOfStartEmployment Date object, date of start employment
             * @param dateOfRetirement     Date object, retirement date
             * @param groupNum             String, this employee's group number
             * @param isVeteran            boolean, is employee a veteran?
             * @param hasBene              boolean, do you have a benefactor?
             * @param beneDoB              Date object, benefactor birthdate.
             * @param retireOption         String, what type of retirement plan
             * @returns {*}
             */
            function getAnnualPension(highestAverageSalary, yearsWorked,
                                      dateOfBirth, dateOfStartEmployment, dateOfRetirement,
                                      groupNum, isVeteran,
                                      hasBene, beneDoB,
                                      retireOption) {

                // TODO more validation.

                const optionEnum = convertOptionToEnum(retireOption);
                const groupEnum = convertGroupToEnum(groupNum);
                const retireAge_Years = Math.round(
                    (dateOfRetirement.getTime() - dateOfBirth.getTime()) / (1000 * 3600 * 24 * 365));

                // Eligible for retirement
                if (isEligibleForRetirement(dateOfStartEmployment, retireAge_Years, yearsWorked, groupEnum)) {
                    throw "Not eligible for retirement!";
                }

                const maxAnnualPension = getMaxAnnualPension(highestAverageSalary, yearsWorked,
                                                                dateOfBirth, dateOfRetirement, groupNum, isVeteran);
                
                switch (optionEnum) {
                    case RetirementOption.A:
                        return {"annualPension": maxAnnualPension, "beneAnnualPension": 0};
                    case RetirementOption.B:
                        return {"annualPension": calcOptionB(maxAnnualPension, retireAge_Years),
                                "beneAnnualPension": 0};
                    case RetirementOption.C:
                        if (!hasBene) {
                            throw "Option C requires a benefactor!"
                        } else {
                            // TODO Implement this: need to clarify calculation method.
                        }
                        throw "Option C is not yet implemented!";
                }
            }
        });
})();
