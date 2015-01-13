var express = require('express');
var router = express.Router();
var io = require('socket.io');
/* GET home page. */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
	res.render('userlist',{"userlist":docs
	});
});
});

router.post('/finduser', function(req, res) {
    // Get our form values. These rely on the "name" attributes
    var db = req.db;
    var userName = req.body.loginname;
    var userpassword = req.body.loginpassword;
    // Set our collection
    var collection = db.get('usercollection');
    collection.findOne({ "username" : userName,
			 "password" : userpassword
}, function (err,member) {
	if(member == null) {
	console.log('a');
	}
	else {
	console.log("aaa");
            res.location("main");
            res.redirect("main");
	}
    });
});
//chat client 에 대한 응답
router.post('/chat',function(rea, res) {
io.on('connection', function(socket){
  console.log('a user connected');
 socket.broadcast.emit('hi');
   socket.on('chat message', function(msg){
    console.log('message: ' + msg);
io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
	var msg = req.body;
 	console.log('chat');
	console.log(req.body);
});
router.post('/adduser', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userpassword = req.body.userpassword;
    // Set our collection
    var collection = db.get('usercollection');
    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail,
        "password" : userpassword
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});
// mobile client에 대한 서버응답
router.post('/add', function ( req, res) {
 
  var userName = req.body.username;
  var userpassword = req.body.userpassword;
  console.log(userName);
  console.log(userpassword);
  console.log('1');
    var db=req.db;
    var collection = db.get('usercollection');
console.log('2');
       collection.findOne({ "username" : userName,
                         "password" : userpassword
}, function (err,member) {
        if(member == null) {
        console.log('log in fail');
        }
        else {
        console.log("aaa");
	console.log(userName);
        res.send(member);
        }
    });
console.log('3');
});

module.exports = router;
