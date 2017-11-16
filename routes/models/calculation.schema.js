var mongoose = require('mongoose');

var calculationSchema = mongoose.Schema(
    {
        highestAverageSalary : Date,
        birthMoment          : Date,
        startMoment          : Date,
        retireMoment         : Date,
        groupNum             : String,
        veteranYears         : Date,
        beneBirthMoment      : Date
    },
    { collection: 'calculation'} // Explicitly declare collection name
);

module.exports = calculationSchema;
