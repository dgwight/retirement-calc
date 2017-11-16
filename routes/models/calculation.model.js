var mongoose = require("mongoose");
var calculationSchema = require("./calculation.schema");
var calculationModel = mongoose.model("CalculationModel", calculationSchema);

// Declare and export functions on this model 
calculationModel.findCalculation = findCalculation;
calculationModel.createCalculation = createCalculation;
module.exports = calculationModel;

function findCalculation(calculationId) {
    return calculationModel.findById(calculationId);
}

function createCalculation(calculation) {
    return calculationModel.create(calculation);
}
