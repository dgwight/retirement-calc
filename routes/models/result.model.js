var mongoose = require("mongoose");
var resultSchema = require("./result.schema");
var resultModel = mongoose.model("resultModel", resultSchema);

// Declare and export functions on this model 
resultModel.getResult = getResult;
resultModel.createResult = createResult;
module.exports = resultModel;

function getResult(resultId) {
    return resultModel.findById(resultId);
}

function createResult(result) {
    return resultModel.create(result);
}
