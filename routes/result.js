var express = require('express')
var router = express.Router()

var resultModel = require("./models/result.model");

router.post("/", createResult);
router.get ("/:resultId", getResult);

function createResult(req, res) {
    var result = req.body;
    resultModel
        .createResult(result)
        .then(function (result) {
            res.send(result._id);
        }, function (err) {
            res.sendStatus(404);
        });
}

function getResult(req, res) {
    var resultId = req.params.resultId;

    resultModel
        .getResult(resultId)
        .then(function (result) {
            res.send(result);
        }, function () {
            res.sendStatus(404);
        });
}

module.exports = router
