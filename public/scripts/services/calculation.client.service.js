'use strict';

(function () {
    angular
        .module("testApp")
        .factory("CalculatorService", function ($http) {

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
             * Represents an enumeration for all employee groups.
             */
            class EmployeeGroup {
                constructor(name) {
                    this.name = name;
                }

                toString() {
                    return `EmployeeGroup.${this.name}`;
                }
            }
            initEnums();

            return {
                "getAnnualPension": getAnnualPension,
                "createCalculation": createCalculation
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


            function getWeightedRetirementAge(retireAge_Years, group) {
                switch (group) {
                    case "1":
                        return retireAge_Years + 5.0;
                    case "2":
                        return retireAge_Years + 5.0;
                    case "4":
                        return retireAge_Years + 10.0;
                    default:
                        return retireAge_Years;
                }
            }

            function getAgeFactor(retireAge_Years, group) {
                const weightedAge = getWeightedRetirementAge(retireAge_Years, group);

                if (weightedAge >= 67) {
                    return 0.025;
                } else if (weightedAge >= 60) {
                    return ((0.125 * weightedAge ) - 5.875) / 100.0;
                } else {
                    return 0;
                }
            }

            function getMaxAnnualPension (highestAverageSalary, years, retireAge_Years,
                                          group, veteranYears) {
                const ageFactor = getAgeFactor(retireAge_Years, group);
                const baseMaxAnnualPension = ageFactor * years * highestAverageSalary;
                return veteranYears < 20 ? baseMaxAnnualPension + veteranYears * 15 : baseMaxAnnualPension + 300;
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
             * Used for calculating pension for Option C
             * @param maxPension
             * @param retireAge_Years
             * @param beneficiaryAge_Years
             * @returns {number}
             */
            function calcOptionC(maxPension, retireAge_Years, beneficiaryAge_Years) {
                let percent;

                $.getJSON( "optionC.json", function( data ) {
                  percent = data[retireAge_Years - 1][beneficiaryAge_Years - 1];
                });

                return maxPension * percent;
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
                let secondPolicyDate = new Date("4/2/2012").getTime();
                let isFirstPolicy =  dateOfStartEmployment < secondPolicyDate;
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
             * Calculates the rounded amount of years between two Moment timstamps
             * @param MomentStart in seconds
             * @param MomentEnd in seconds
             * @returns {number}
             */
            function calcYearsBetween(MomentStart, MomentEnd) {
                return Math.round(MomentEnd.diff(MomentStart, 'years', true));
            }

            /**
             * Exposed function for calculating the annual pension.
             *
             * @param highestAverageSalary  Float, highest average salary in dollars
             *
             * @param birthMoment             long, Moment timestamp in seconds
             * @param startMoment             long, Moment timestamp in seconds
             * @param retireMoment            long, Moment timestamp in seconds
             *
             * @param groupNum              String, this employee's group number
             * @param veteranYears          int, nullable, years served as a veteran
             *
             * @param beneBirthMoment         long object, benefactor birth date.
             *
             * @param retireOption          String, what type of retirement plan
             *
             * @returns {*}                 either:
             *                              {"annualPension": number, "beneAnnualPension": number};
             *                              or if beneAnnualPension does not apply:
             *                              {"annualPension": number}
             * @throws                      if option C is selected and beneBirthMoment was None.
             * @throws                      the argument length does not match.
             * @throws                      the option or group number does not match any enum defined
             */
            function getAnnualPension(highestAverageSalary,
                                      birthMoment, startMoment, retireMoment,
                                      groupNum, veteranYears,
                                      beneBirthMoment,
                                      retireOption) {

                // TODO more validation
                if (arguments.length !== getAnnualPension.length) {
                    throw "Argument length does not match!";
                }
                const optionEnum = convertOptionToEnum(retireOption);
                const groupEnum = convertGroupToEnum(groupNum);

                const retireAge_Years = calcYearsBetween(birthMoment, retireMoment);
                const yearsWorked = calcYearsBetween(startMoment, retireMoment);

                // Check if eligible for retirement
                if (!isEligibleForRetirement(startMoment, retireAge_Years, yearsWorked, groupEnum)) {
                    throw "Not eligible for retirement!";
                }

                const maxAnnualPension = getMaxAnnualPension(
                    highestAverageSalary, yearsWorked, retireAge_Years,
                    groupNum, veteranYears);

                switch (optionEnum) {
                    case RetirementOption.A:
                        return {"annualPension": maxAnnualPension};
                    case RetirementOption.B:
                        return {"annualPension": calcOptionB(maxAnnualPension, retireAge_Years)};
                    case RetirementOption.C:
                        if (!beneBirthMoment) {
                            throw "Option C requires a benefactor!";
                        } else {
                            // TODO Implement this: need to clarify exactly how to calculate this!
                            return {"annualPension": calcOptionC(maxAnnualPension, retireAge_Years, calcYearsBetween(beneBirthMoment, retireMoment))};
                        }
                }
            }

            /**
             *
             * @param calculation       The calculation object
             */
            function createCalculation(calculation) {
                console.log(calculation);
                var url = "/calculation";
                return $http.post(url, calculation);
            }
        });
})();
