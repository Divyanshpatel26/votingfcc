// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
// MongoDB
var config      = require('./config/database'); // get db config file
var User        = require('./models/user'); // get the mongoose model
var port 	      = process.env.PORT || 8080;
var jwt 			  = require('jwt-simple');
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// Express
var app = express();
 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 app.use(passport.initialize());
 require('./config/passport')(passport);
 require('./routes/api');
var authenticationRoutes = express.Router();
// Routes
authenticationRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    newUser.save(function(err) {
      if (err) {
        res.json({success: false, msg: 'Username already exists.'});
      } else {
        res.json({success: true, msg: 'Successful created user!'});
      }
    });
  }
});
var getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
authenticationRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.encode(user, config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

app.get('/memberinfo', passport.authenticate('jwt', {session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        return res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


app.use('/authentication',authenticationRoutes);
app.use('/api', require('./routes/api'));
 
// Start server
var port = 8080
, ip = '0.0.0.0'
app.listen(port, ip, function() {
  console.log('Express server listening on %d', port);
});
