var express = require('express');
var router = express.Router();
var io = require('socket.io');
var fs = require('fs');
/* GET home page. */
router.get('/', function (req, res) {
  fs.readFile('index.html', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});
router.get('/project', function (req, res) {
  fs.readFile('project.html', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});
router.get('/mainadd', function (req, res){
	var User_Email = req.session.User_Email;
	var User_Name = req.session.User_Name;
	console.log('main add console: ');
	console.log(User_Email);
	console.log(User_Name);
  res.send({
                User_Email:req.session.User_Email,
                User_Name:req.session.User_Name,
                });
});
router.get('/projectadd', function(req, res) {
    var db = req.db;
    var User_Email = req.session.User_Email;
    var User_Pass = req.session.User_Pass;
    var pName = new Array();
	console.log('project session: ');
	console.log(User_Email);
	console.log(User_Pass);
//	console.log('cookies:');
//	console.log(req.cookies.User_Name);
    // Set our collection
    var collection = db.get('User');
    collection.findOne({ "User_Email" : User_Email,
     "User_Pass" : User_Pass
 }, function (err,member) {
     if(member == null) {
      console.log('false');
  }
  else {
    var collection2 = db.get('Project_Member');
    collection2.find({ "User_Id" : member._id}, function (err,memo) {
        if(memo == null) {
        }
        else{
//	 console.log('memo :');
//	 console.log(memo);
//         console.log(memo.length);
//         console.log(memo[0].Project_Name);
//         console.log(memo[1].Project_Name);
	for(var i=0;i<memo.length;i++){
		pName[i] = memo[i].Project_Name;	
	}
     }
console.log('finish project add');
	res.send({
		User_Email:req.session.User_Email,
		User_Name:req.session.User_Name,
		length:memo.length,
		Project_Name:pName
		});
});
}
});
});

//image upload
router.post('/upload',function (req, res)  {
//console.log('begin');
//console.log('start');
console.log(req.files);
//  var files = req.files.files; // files array
//console.log(files.path);
//    fs.rename( files.path,files.name, function( error ) {
//	console.log(req.files);
//      if( error){
//        res.send('Error upload files');
//        return false;
//      }
//    });
  res.send( 'Success upload files' );
});

router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('User');
	collection.find({},{},function(e,docs){
	res.render('userlist',{"userlist":docs
	});
});
});

router.post('/login', function(req, res) {
    // Get our form values. These rely on the "name" attributes
    var db = req.db;
    var userName = req.body.loginname;
    var userpassword = req.body.loginpassword;
 //   res.clearCookie('User_Email');
 //   res.clearCookie('User_Name');
 //   res.clearCookie('User_Pass');

console.log('user name start !!!');
    // Set our collection
    var collection = db.get('User');
    collection.findOne({ "User_Email" : userName,
			 "User_Pass" : userpassword
}, function (err,member) {
	if(member == null) {
	console.log('a');
	}
	else {
//	console.log("log in");
//	console.log(member);
//	console.log(member.User_Name);
//	console.log(member.User_Email);
//	console.log(member.User_Pass);
//	console.log(member._id);
var collection2 = db.get('Project_Member');
collection2.find({ "User_Id" : member._id}, function (err,memo) {
if(memo == null) {	
	console.log('nothing');
}
else{
//	console.log(memo);
//	console.log(memo.length);
//	console.log(memo[0].Project_Name);
//	console.log(memo[1].Project_Name);
}
});
	res.set({'Content-Type' : 'text/plain ,charset=utf-8'});
  //          res.location("main");
	//	res.send(member);
            //쿠기값 설정하기
	    //res.cookie('User_Email',member.User_Email,"utf-8");
		console.log('session : ssss');
	    req.session.User_Email = member.User_Email;
		console.log(req.session.User_Email);
	  //  res.cookie('User_Name',member.User_Name);
		req.session.User_Name = member.User_Name;
		console.log(req.session.User_Name);
		req.session.User_Pass = userpassword;
		console.log(req.session.User_Pass);
		console.log('login finish');
	   // res.cookie('User_Pass',member.User_Pass);
            res.redirect("project");
	}
    });
});
//chat client 에 대한 응답mobile
//router.post('/chat',function(rea, res) {
//io.on('connection', function(socket){
//console.log('5');
 //socket.broadcast.emit('hi');
//   socket.on('chat message', function(msg){
//console.log('6');
//    console.log('message: ' + msg);
//io.emit('chat message', msg);
//  });
//  socket.on('disconnect', function(){
//    console.log('user disconnected');
//  });
//});
//console.log('7');
//	var msg = req.body;
// 	console.log('chat');
//	console.log(req.body);
//});
router.post('/register', function(req, res) {
    // Set our internal DB variable
    var db = req.db;
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var userpassword = req.body.userpassword;
    // Set our collection
    var collection = db.get('User');
    // Submit to the DB
    collection.insert({
        "User_Email" : userEmail,
        "User_Name" : userName,
        "User_Pass" : userpassword
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

  var User_Email = req.body.User_Email;
  var User_Pass = req.body.User_Pass;
  console.log(User_Email);
  console.log(User_Pass);
    var db=req.db;
    var collection = db.get('User');
       collection.findOne({ "User_Email" : User_Email,
                         "User_Pass" : User_Pass
}, function (err,member) {
        if(member == null) {
        console.log('log in fail');
        }
        else {
        console.log("aaa");
        res.send(member);
        }
    });
});
//mobile project create
router.post('/appprojectadd', function(req, res) {
    // Get our form values. These rely on the "name" attributes
    var db = req.db;
    var User_Email = req.body.User_Email;
    var User_Pass = req.body.User_Pass;
	console.log('app project add');
	console.log(User_Email);
	console.log(User_Pass);
    // Set our collection
    var collection = db.get('User');
    collection.findOne({ "User_Email" : User_Email,
       "User_Pass" : User_Pass
   }, function (err,member) {
       if(member == null) {
          console.log('false');
      }
      else {
        var collection2 = db.get('Project_Member');
        collection2.find({ "User_Id" : member._id}, function (err,memo) {
            if(memo == null) {
            }
            else{
               console.log('app memo :');
               console.log(memo);
               console.log(memo.length);
               console.log(memo[0].Project_Name);
               console.log(memo[1].Project_Name);
           }
           res.send(memo);
       });
    }
});
});

router.post('/appprojectcreate', function(req ,res) {

	 var db = req.db;
	var Project_Db = db.get("Project");
	
	var User_Id = req.body.User_Id;
	var Project_Name = req.body.Project_Name;
	var Project_Dday = req.body.Project_Dday;
	var User_Email = req.body.User_Email;
	var User_Name = req.body.User_Name;
console.log('-------------------------------------');
console.log(User_Id);
console.log(Project_Name);
console.log(Project_Dday);
console.log(User_Email);
console.log(User_Name);
console.log('-------------------------------------');
	var Project_Id;
	Project_Db.insert({"Project_Name" : Project_Name, "Project_Dday":Project_Dday}, function (err,data){
	if(data == null){
	console.log('project insert error');
	}
	else {
	console.log('Project insert success');
	console.log(data._id);
	var User = db.get("User");
	User.findOne({"User_Email":User_Email,"User_Name":User_Name} , function (err,doc) {
	console.log('User FindOne:');
	console.log(User_Email);
	console.log(User_Name);
	if( doc == null ) {
	console.log('user find error');
	} else{
		console.log('user find');
		console.log(doc);
		console.log(doc._id);
var Project_Member_Db = db.get("Project_Member");
		Project_Member_Db.insert({"User_Id":doc._id,"Project_Id":data._id,"Project_Name":data.Project_Name,"Project_Dday":data.Project_Dday,"Member":User_Name }, function (err, member) {
		if(err){
			console.log('Project_Member error');
		} else {
			console.log('Project_Member insert success');
			res.send(member);
			}
		});
	}
		});
	}
});

});
module.exports = router;
