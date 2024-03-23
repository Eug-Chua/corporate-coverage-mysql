const express = require("express");

// set up the handlebars
const hbs = require("hbs");
const wax = require("wax-on");
require('dotenv').config();

const app = express();

// set up view engine
app.set('view engine', 'hbs');

// enable static files
app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('../views/layouts')

// ROUTING
app.get('/', function(req,res){
    res.send('Hello.')
})

// START THE SERVER
app.listen(1010, function(){
    console.log('Server has started.')
})

