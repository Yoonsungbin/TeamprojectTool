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
router.get('/form_memo', function (req, res) {
  fs.readFile('form_memo.html','utf-8', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});
router.get('/upload',function (req, res) {
  fs.readFile('upload.html','utf-8', function (error ,data) {
    res.writeHead(200, { 'Content-Type':'text/html'});
    res.end(data);
  });
});
router.get('/form_fileshare', function (req, res) {
  fs.readFile('form_fileshare.html', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});router.get('/form_mindmap', function (req, res) {
  fs.readFile('form_mindmap.html', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});
router.get('/form_ladder', function (req, res) {
  fs.readFile('form_ladder.html', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});
router.get('/form_cal', function (req, res) {
  fs.readFile('form_cal.html', function (error, data){
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

router.get('/getProjectId',function (req,res) {
	console.log('?????????????????');
	console.log(req.session.Project_Id);
	res.send({
		User_Name:req.session.User_Name,
		User_Email:req.session.User_Email,
		Project_Id:req.session.Project_Id
		});
});
router.post('/findProjectId',function (req , res) {
	 var User_Email = req.session.User_Email;
        var User_Name = req.session.User_Name;
	var Project_Index = req.body.Project_Index;
        console.log('find add console: ');
        var db =req.db;
        var User = db.get('User');
        User.findOne({"User_Name":User_Name,"User_Email":User_Email}, function (err,data) {
        if( data == null ) {
                console.log('find error');
        } else {
        var Project_Member = db.get('Project_Member');
        Project_Member.find({"User_Id":data._id} ,function (err,member) {
                if(member == null){
                        console.log('no member');
                } else {
                        //console.log(member);
                        console.log(Project_Index);
                        var Project_Id = member[Project_Index].Project_Id;
                        req.session.Project_Id=Project_Id;
		        console.log(req.session.Project_Id);
			res.send();
                }

        });
         }
        });
});
router.get('/projectcreate', function(req, res) {
    var db = req.db;
    var User_Email = req.session.User_Email;
    var User_Pass = req.session.User_Pass;
    var pName = new Array();
    var Project_Id = new Array();
	console.log('project session: ');
//	console.log(User_Email);
//	console.log(User_Pass);
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
		Project_Id[i] = memo[i].Project_Id;
	}
     }
console.log('finish project add');
	res.send({
		User_Email:req.session.User_Email,
		User_Name:req.session.User_Name,
		length:memo.length,
		Project_Name:pName,
		Project_Id:Project_Id
		});
});
}
});
});
router.post('/projectadd', function (req,res) {
	var Project_Name = req.body.Project_Name;
	var Project_Dday = req.body.Project_Dday;
	var User_Name =req.session.User_Name;
	var User_Email = req.session.User_Email;
//	console.log('sss');
//	console.log(Project_Name);
//	console.log(Project_Dday);
	var db =req.db;
	var User = db.get('User');
	User.findOne({"User_Name":User_Name,"User_Email":User_Email} , function (err,member){
if(member == null ){
	console.log('member error');
} else {
	var Project = db.get('Project');
	Project.insert({"Project_Name": Project_Name , "Project_Dday":Project_Dday}, function (err,data) {
		if(data == null ) {
			console.log(' project add error');
		} else {
			var Project_Member = db.get('Project_Member');
			Project_Member.insert({"User_Id":member._id,"Project_Id":data._id,"Project_Name":Project_Name,"Project_Dday":Project_Dday,"Member":User_Name,"Member_Position":"captin"} , function (err, doc){
	if(doc == null ) {
		console.log('member add error'); 
	} else {
		res.redirect("project");
	}
	});
	}
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
            res.location("/");
            // And forward to success page
            res.redirect("/");
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
         //      console.log(memo[0].Project_Name);
         //      console.log(memo[1].Project_Name);
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


router.post('/appprojectdelete', function(req ,res) {
	var db =req.db;
        var Project_Name;
        var Project_Dday;
        var User_Email = req.body.User_Email;
        var User_Name = req.body.User_Name;
        var Project_Index = req.body.Project_Index;

console.log('-------------------------------------');
console.log(Project_Index);
console.log(User_Email);
console.log(User_Name);
console.log('-------------------------------------');
 var collection = db.get('User');
 collection.findOne({"User_Email":User_Email}, function(err,data){
    if(data == null) {
            console.log('no user data');
    } else {
	console.log(data);
        var Project_Member_Db = db.get('Project_Member');
        Project_Member_Db.find({"User_Id":data._id} , function(err,member){
            if (member == null){
                console.log('no member data');
            } else {
		console.log('111');
		console.log(member);
		console.log(member[0]);

                Project_Name = member[Project_Index].Project_Name;
                Project_Dday = member[Project_Index].Project_Dday;
                console.log(Project_Name);
                console.log(Project_Dday);
                if(member[Project_Index].Member_Position == "captin"){
                    Project_Member_Db.remove({"Project_Id":member[Project_Index].Project_Id},function(err,note){
                        if(note == null){
                            console.log("no delete project member all");
                        } else {
                            console.log("delete project member all");
			   var Project = db.get('Project');
                            Project.remove({"Project_Name":Project_Name,"Project_Dday":Project_Dday}, function(err,pro){
                                if(pro == null){
                                    console.log('no delete project');
                                } else {
					console.log(pro);
                                    console.log('success delete project');
				var people = db.get('Project_Member');
					console.log(data._id);
                                   people.find({"User_Id":data._id},function(err,finddata){
                                        if(finddata == null){
                                            console.log('no find data');
                                        } else {
					console.log(finddata);
                                            res.send(finddata);
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
			console.log(member[Project_Index].Project_Id);
			console.log(member[Project_Index].Project_Name);
                    Project_Member_Db.remove({"Project_Id":member[Project_Index].Project_Id},function(err,doc){
                        if(doc == null){
                            console.log('no delete user');
                        } else {
                            console.log('success delete user');
			console.log(data._id);
			var second = db.get('Project_Member');
                            second.find({"User_Id":data._id},function(err,finddata2){
                                        if(finddata2 == null){
                                            console.log('no find data');
                                        } else {
					console.log(finddata2);
                                            res.send(finddata2);
                                        }
                                    });
                        }
                    });
                }
            }
        });
    }
 });
});


router.post('/addprojectmember',function(req ,res) {
  var db = req.db;
  var Project_Index = req.body.Project_Index;
  var Member_Email = req.body.Member_Email;
  var User_Pass = req.body.User_Pass;
  var User_Email = req.body.User_Email;
  var Project_Db = db.get("Project");
  var Project_Member_Db = db.get("Project_Member");
  var User_Db = db.get("User");
  console.log('-------------------------------------');
  console.log(Project_Index);
  console.log(Member_Email);
  console.log(User_Email);
  console.log('-------------------------------------');


  console.log(User_Email);
  console.log('a');

  User_Db.findOne({ "User_Email" : User_Email,
    "User_Pass" : User_Pass
  }, function (err,member) {
    if(member == null) {
      console.log('false');
    }
    else {

      Project_Member_Db.find({ "User_Id" : member._id}, function (err,projectmemberinfo) {
        if(projectmemberinfo == null) {
        }
        else{
          User_Db.findOne({"User_Email":Member_Email}, function(err, userinfo){
            // user id, name 찾기 완료
            if(userinfo == null){
              console.log('can not find user');
            }
            else {
              console.log('c');
              //User._id, project._id User_Name있으니까 추가하는곳
              console.log(projectmemberinfo[Project_Index]);
		console.log(Project_Index);
              Project_Member_Db.insert({
                    "User_Id": userinfo._id,
                    "Project_Id": projectmemberinfo[Project_Index].Project_Id,
                    "Project_Name": projectmemberinfo[Project_Index].Project_Name,
                    "Project_Dday": projectmemberinfo[Project_Index].Project_Dday,
                    "Member": userinfo.User_Name
                  }
                  , function (err, data) {
                    if (err) {
                      console.log('fail');
                    }
                    else {
                      console.log(projectmemberinfo[Project_Index].Project_Id);
                      res.send(projectmemberinfo[Project_Index].Project_Id);
                    }
                  }
              );
            }
          });
        }
      });
    }
  });
});

router.post('/appregister', function(req, res) {
  // Set our internal DB variable
  var db = req.db;
  // Get our form values. These rely on the "name" attributes
  var User_Name = req.body.User_Name;
  var User_Email = req.body.User_Email;
  var User_Pass = req.body.User_Pass;
  console.log('app register');
  console.log(User_Name);
  console.log(User_Email);
  console.log(User_Pass);
  console.log();
  // Set our collection
  var collection = db.get('User');
  // Submit to the DB
  collection.insert({
    "User_Email" : User_Email,
    "User_Name" : User_Name,
    "User_Pass" : User_Pass
  }, function (err, doc) {
    if (err) {
      res.send("There was a problem adding the information to the database.");
    }
    else {
    console.log("success add");
      res.send(doc);
    }
  });
});

router.post('/projectmemberlist', function(req, res) {
  var db = req.db;
  var User_Email = req.body.User_Email;
  var User_Pass = req.body.User_Pass;
  var Project_Index = req.body.Project_Index;
  var Project_Member_Db = db.get('Project_Member');
  var User_Db = db.get('User');


  User_Db.findOne({
    "User_Email": User_Email, "User_Pass": User_Pass
  }, function (err, member) {
    if (member == null) {
      console.log('false');
    }
    else {

      Project_Member_Db.find({"User_Id": member._id}, function (err, projectmemberinfo) {
        if (projectmemberinfo == null) {
        }
        else {
          var Project_Id = projectmemberinfo[Project_Index].Project_Id;
          console.log(Project_Id);
          Project_Member_Db.find({"Project_Id": Project_Id}, function (err, data) {
            console.log('success view');
            console.log(data.length);
            res.send(data);
          });
        }
      });
    }
  });
});

module.exports = router;
