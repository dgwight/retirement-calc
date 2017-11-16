var express = require('express')
var router = express.Router()

var calculationModel = require("./models/calculation.model");

router.post("/", createUser);
router.get ("/:calculationId", getUser);

function createUser(req, res) {
    var calculation = req.body;
    calculationModel
        .createCalculation(calculation)
        .then(function (calculation) {
            console.log(calculation);
            res.send(calculation._id);
        });
}

function getUser(req, res) {
    var calculationId = req.params.calculationId;

    calculationModel
        .findCalculation(calculationId)
        .then(function (calculation) {
            res.send(calculation);
        }, function () {
            res.sendStatus(404);
        });
}

module.exports = router