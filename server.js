// ---------------------------------- EXPRESS ----------------------------------
var express = require('express')
var app = express()
var cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));
var bodyParser    = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ----------------------------- EXPOSE PUBLIC FILES ---------------------------
app.use(express.static(__dirname + '/public'));

// ---------------------------------- DATABASE ---------------------------------
var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost/pension';
if(process.env.MONGODB_URI) {                       // check if running remotely
    var connectionString = process.env.MONGODB_URI;
}
mongoose.connect(connectionString);
var db = mongoose.connection;

// ----------------------------------- ROUTES ----------------------------------
var calculation = require('./routes/calculation')
app.use('/calculation', calculation)

// -------------------------------- START SERVER -------------------------------
app.listen(process.env.PORT || 3000);
console.log('PENSION MASTER listening on port 3000!')

//module.exports = app;
