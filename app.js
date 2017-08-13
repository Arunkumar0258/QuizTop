const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const mongoStore = require('connect-mongo')(session)
const passport = require('passport');
const config = require('./configs/config');
const mainRoutes = require('./controllers/mainRoutes')
const apiRoutes = require('./controllers/apiRoutes')


mongoose.Promise = global.Promise;
var app = express();

mongoose.connect(config.dbUrl, function(err) {
    if(err) console.log(err.stack);
    console.log('Connected to database at ' + config.dbUrl)
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
require('./configs/passportconf')(passport)

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')

app.use(mainRoutes);
app.use('/api',apiRoutes);

app.use(function(err,req,res,next) {
        res.status(err.status | 500).send('Internal Server Error');
        next(err)
})

app.use(function(req,res,next) {
        var err = new Error('Not Found')
        err.status = 404;
})

var server = app.listen(config.apiPort, function() {
    var port = server.address().port;
    console.log('Server is running at localhost:' + port);
})
