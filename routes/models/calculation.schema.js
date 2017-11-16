var mongoose = require('mongoose');

var calculationSchema = mongoose.Schema(
    {
        highestAverageSalary : Number,
        birthMoment          : Number,
        startMoment          : Number,
        retireMoment         : Number,
        groupNum             : String,
        veteranYears         : Number,
        beneBirthMoment      : Number,
        retireOption         : String
    },
    { collection: 'calculation'} // Explicitly declare collection name
);

module.exports = calculationSchema;
