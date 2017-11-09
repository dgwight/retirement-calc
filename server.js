const express = require('express')
const app = express()

// Expose Angular app and public files
app.use(express.static(__dirname + '/public'));

// Run the rest of the node app
require("./routes/index.js")

app.listen(process.env.PORT || 3000);
console.log('PENSION MASTER listening on port 3000!')
