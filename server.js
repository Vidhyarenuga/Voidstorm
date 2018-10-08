
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var ejs = require('ejs');
var engine = require('ejs-mate');
var passport = require('passport');
var session  = require('express-session');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');
 
// var expressValidator = require('express-validator');


var app = express();


//---------Require to request  values from the secret.js file 
var secret = require('./config/secret');
var adminRoutes=require('./routes/adminroutes');

const https = require("https"),
  fs = require("fs");

const options = {
  key: fs.readFileSync("key.pem","utf8"),
  cert: fs.readFileSync("server.crt","utf8")
};

//--------<Connecting the nodejs to the mongodb>---------------
// mongoose.connect(secret.database, function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Connected to the database");
//   }
// });
const connect = mongoose.connect(secret.database,{
  useNewUrlParser: true
});
connect.then((db) => {

  console.log('Connected correctly to server');
});

//-------<Adding middlewares>--------------
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
var bodyParser = require('body-parser');

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(morgan('dev'));
app.use(cookieParser());
//-------Middleware to store the session details-------------
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true }),
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});



require('./routes/main')(app);
require('./routes/user')(app);
require('./routes/teacher')(app);
require('./routes/payment')(app);
require('./routes/adminroutes');
require('./routes/admincategories')(app);
require('./routes/adminfos')(app);


app.use('/admin',adminRoutes);

app.listen(secret.port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on port " + secret.port);
  }
});

https.createServer(options, app).listen(8082);
