var mongoose = require('mongoose');

var resultSchema = mongoose.Schema(
    {
        highestAverageSalary : Number,
        birthMoment          : Date,
        startMoment          : Date,
        retireMoment         : Date,
        groupNum             : String,
        yearsWorked          : Number,
        isVeteran            : Boolean,
        beneBirthMoment      : Date
    },
    { collection: 'result'} // Explicitly declare collection name
);

module.exports = resultSchema;
