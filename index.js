// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var ObjectId = require('mongoose').ObjectId;
// MongoDB
var config      = require('./config/database');
var User        = require('./models/user');
var Poll        = require('./models/poll');
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
var pollrouter = express.Router();
pollrouter.delete("/poll/:id",passport.authenticate('jwt',{session:false}),function(req,res){
   var token = getToken(req.headers);
  if(token){
    Poll.findOneAndRemove({"_id":req.params.id},function(err,data){
      if(err) throw err;
      return res.status("200").send({success:true,msg:"Poll deleted correctly"});
    })
  }
  else{
        return res.status("403").send({success:false,msg:"No token provided"})

  }
})
pollrouter.get("/poll/username/:username",passport.authenticate('jwt',{session:false}),function(req,res){
  var token = getToken(req.headers);
    

  if(token){
    Poll.find({username:req.params.username},function(err,data){
      if(err) throw err;
          return res.status('200').send({success:true,msg:data});

    });
  }
  else
  {
    return res.status("403").send({success:false,msg:"No token provided"})
  }
})
pollrouter.patch("/poll/addoption/:id",function(req,res){
  Poll.findById(req.params.id,function(err,tank){
    if(err) throw err;
    var option = req.body.option;
    tank.answers.push(option);
    tank.markModified("answers");
    tank.save(function(err){
      if(err) throw err;
      res.send(tank);
    })
  });
})
pollrouter.patch("/poll/vota/:id",function(req,res){
 Poll.findById(req.params.id, function (err, tank) {
  if (err) throw(err);
  for(var i=0;i<tank.answers.length;i++){
    if(tank.answers[i].name===req.body.choice){
      if(tank.answers[i].count){
        tank.answers[i].count+=1;
      }
      else{
        tank.answers[i].count =1;
      }
    }
  }
  tank.markModified("answers");
  tank.save(function (err) {
    if (err) throw (err);
    res.send(tank);
  });
});

})
pollrouter.get("/poll/view/:id/",function(req,res){
Poll.find({"_id":req.params.id}, function (err, user) {
  if(err) throw err;
          return res.send(user);

    });
})
pollrouter.get("/poll/get",function(req,res){
    Poll.find({},function(err,data){
      if(err) throw err;
          return res.status('200').send({success:true,msg:data});

    });
})
pollrouter.post("/poll/new",passport.authenticate('jwt', {session: false}),function(req,res){
 var token = getToken(req.headers);
  if (token) {
    var newPoll = new Poll({
      name: req.body.name,
      description: req.body.description,
      id_users:req.body.id_user,
      answers:req.body.answers,
      username:req.body.username
    });
    newPoll.save(function(err) {
      if (err) {
        console.log(err);
        res.send({success:false,msg:err})
      } else {
        res.send({success: true, msg: 'Successful created Poll!'});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
 });
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
        res.status(400).send({success: false, msg: 'Username already exists.'});
      } else {
        res.send({success: true, msg: 'Successful created user!'});
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
          console.log(token);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

authenticationRoutes.get('/memberinfo', passport.authenticate('jwt', {session: false}), function(req, res) {
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
        return res.json({success: true, msg: user.name});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


app.use('/authentication',authenticationRoutes);
app.use('/api', pollrouter);
// Start server
var port = 8080
, ip = '0.0.0.0'
app.listen(process.env.PORT,  function() {
  console.log('Express server listening on %d', port);
});
