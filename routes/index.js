var express = require('express');
var router = express.Router();
//var io = require('socket.io');
var fs = require('fs');
var Time = require('date-utils');
var ObjectID = require('mongodb').ObjectID;
/* GET home page. */

/* First Page */
router.get('/', function (req, res) {
  fs.readFile('index.html', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});

/* Sign In */
router.post('/SignIn',function(req, res) {

  var db = req.db;
  var userName = req.body.loginname;
  var userpassword = req.body.loginpassword;
  var collection = db.get('User');
  collection.findOne({ "User_Email" : userName,
    "User_Pass" : userpassword
  }, function (err,member) {
   if(member == null) {
    console.log('a');
  } else {
   var collection2 = db.get('Project_Member');
   collection2.find({ "Member.Member_Id" : member._id}, function (err,memo) {
    if(memo == null) {  
     console.log('nothing');
   } else{
   }
 });
           //res.set({'Content-Type' : 'text/plain ,charset=utf-8'});
           req.session.User_Email = member.User_Email;
           req.session.User_Name = member.User_Name;
           req.session.User_Pass = userpassword;
           res.redirect("project");
         }
       });
});


/* Sign Up */
router.post('/SignUp', function(req, res) {
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
      "User_Pass" : userpassword,
      "Access":'false'
    }, function (err, doc) {
      if (err) {
      }
      else {
//            res.location("/");
res.redirect("/");
}
});
  });

/* Layout */
router.get('/Frame', function (req, res) {
  fs.readFile('Frame.html','utf-8', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});

/* Task */
router.get('/Task', function (req, res) {
  fs.readFile('Task.html', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});

/* Task Add*/
router.post('/TaskNewAdd',function (req,res) {
console.log('업무추가버튼클릭하고 들어옴');
 var db = req.db;
 var Task_Name = req.body.Task_Name;
 var Task_Dday = req.body.Task_Dday;
 var Task_Person = req.body.Task_Person;
 var Task_Memo = req.body.Task_Memo;
 var Project_Work = db.get('Project_Work');
console.log(req.body.Task_Name);
console.log(req.body.Task_Dday);
console.log(req.body.Task_Memo);
var Work_Person = new Array();
var UserInfo = new Object();
UserInfo.User_Name=req.session.User_Name;
UserInfo.User_Email = req.session.User_Email;
Work_Person.push(UserInfo);
var dataform = JSON.stringify(Work_Person);
var Person =JSON.parse(dataform);

 Project_Work.insert({"Project_Id":ObjectID(req.session.Project_Id),"Work_Name":Task_Name,"Work_Dday":Task_Dday,"Work_Memo":Task_Memo,"Work_Finish":'ing',"Work_Top":'480px',"Work_Left":'30px',"Work_Person" :Person} ,function(err,data){
    if(data  == null){
      console.log('업무삽입실패')
    } else {
     console.log('업무삽입되었음');
     res.redirect("Task");
   }
 });
});

/*Task Init*/
router.get('/TaskAppend', function(req, res) {
	console.log('업무 초기화 리로드');
	 var db = req.db;
	 var Project_Work = db.get('Project_Work');

 Project_Work.find({"Project_Id":ObjectID(req.session.Project_Id)} ,function(err,data){
    if(data  == null){
     console.log('데이터없음');
   }  else {
	console.log(data);
	res.send(data);
	}
	});
});

/*Task move save */
   router.post('/Get_TaskData',function(req,res){
	console.log('업무 데이터저장 ');
    var Work_Id = req.body.Work_Id;
    var x = req.body.x;
    var y = req.body.y;
    var db = req.db;
    var Project_Work = db.get('Project_Work');
Project_Work.update({"_id":ObjectID(Work_Id)},{$set:{"Work_Top":y+'px',"Work_Left":x+'px'}});
   });

/*dbclick Task Update */
 router.post('/Update_TaskData',function(req,res){
  console.log('더블클릭햇을때 데이터 업로드');
  var Work_Id = req.body.Work_Id;
  var db = req.db;
  var Project_Work = db.get('Project_Work');
  var Work_Comment = db.get('Work_Comment');
  Project_Work.findOne({"_id":ObjectID(Work_Id)},function(err,data){
    if(data == null){
      console.log('no id');
    } else {
     console.log(data);
     Work_Comment.find({"Project_Work_Id":ObjectID(Work_Id)},function(err,com){
       if(com == null){

       } else {
        console.log(com);
        res.send(data);
      }
    });
   }
 });
});

/* Label */
 router.get('/LabelAppend',function(req,res){
   console.log('라벨초기화');

   var db = req.db;
   var Label_DB = db.get('Project_Work_Label');

   Label_DB.find({"Project_Id":ObjectID(req.session.Project_Id)},function(err,data){
   if(data == null){
	console.log('no data');
   } else {
      console.log(data);
      res.send(data);
   }
   });
   });
/* Lavel add */
router.post('/LabelAdd',function(req,res){
   var db = req.db;
   var Label_Name = req.body.Label_Name;
   var Label = db.get('Project_Work_Label');

   Label.insert({"Project_Id":ObjectID(req.session.Project_Id),"Label_Name":Label_Name,"Label_Top":'440px',"Label_Left":'30px'},function(err,data){
   if(data == null){

   }  else {
      console.log(data);
      res.redirect("Task");
   }
   });
});
/* lavel move save */
  router.post('/Get_LabelData',function(req,res){
        console.log('라벨 위치저장 ');
    var Work_Id = req.body.Work_Id;
    var x = req.body.x;
    var y = req.body.y;
    var db = req.db;
    var Label = db.get('Project_Work_Label');
Label.update({"_id":ObjectID(Work_Id)},{$set:{"Label_Top":y+'px',"Label_Left":x+'px'}});
   });

/*dbclick Label Update */
 router.post('/Update_LabelData',function(req,res){
  console.log('더블클릭햇을때라벨 업로드');
  var Work_Id = req.body.Work_Id;
  var db = req.db;
  var Label = db.get('Project_Work_Label');
  Label.findOne({"_id":ObjectID(Work_Id)},function(err,data){
    if(data == null){
      console.log('no id');
    } else {
     console.log(data);
        res.send(data);
      }
    });
 });


router.get('/form_memo', function (req, res) {
  fs.readFile('form_memo.html','utf-8', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});

router.get('/form_temp', function (req, res) {
  fs.readFile('form_temp.html','utf-8', function (error, data){
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
});

router.get('/form_mindmap', function (req, res) {
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

router.get('/Calendar', function (req, res) {
  fs.readFile('Calendar.html', function (error, data){
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

/* Member Add PopUp */
router.get('/MemberPopUp', function (req, res) {
  fs.readFile('MemberPopUp.html','utf-8', function (error, data){
    res.writeHead(200, { 'Content-Type':'text/html' });
    res.end(data,'utf8');
  });
});
/* Meber PopUp & Find */
router.post('/MemberFind', function (req,res) {
  console.log(req.session);
  console.log(req.body.Member_Email);
  var db = req.db;
  var User = db.get('User')
  var name;
  User.findOne({"User_Email":req.body.Member_Email} , function (err, data) {
    if( data == null ) {
     name = "";		
   } else {	
     name = data.User_Name;
   }
   console.log(name);
   res.send({Member_Name:name});
 });
});

/* Member Add */
router.post('/MemberAdd', function (req,res) {
	console.log('멤버 추가');
	console.log(req.session);
	console.log(req.body.Member_Email);
	var db = req.db;
	var User = db.get('User')
	User.findOne({"User_Email":req.body.Member_Email} , function (err, data) {
		if( data == null ) {
		console.log('실패');
		} else {
      var Project = db.get('Project');
      Project.findOne({"Project_Name":req.session.Project_Name,"Project_Dday":req.session.Project_Dday}, function (err, pro) {
       if( pro == null ) {
	console.log('프로젝트찾기실패');
       } else {
	console.log('프로젝트찾음');
	console.log(pro);
        var Project_Member = db.get('Project_Member');
        Project_Member.update({"Project_Id":pro._id},{$push:{"Member":{"Member_Id":data._id,"Member_Name":data.User_Name,"Member_Position":"crew","Member_Access":'false'}}} , function (err,member) {
         if(member == null ) {
	  console.log('멤버 저장 실패');
         } else {
          console.log('멤버 저장되었습니다');
          res.send({suc:"true"});
        }
      });
      }
    });
    }
  });
});

/* Project Page to Init Data*/
router.get('/Get_ProjectData',function (req,res) {
console.log('get data project');
	console.log(req.session);
  res.send({
    User_Name:req.session.User_Name,
    User_Email:req.session.User_Email,
    Project_Id:req.session.Project_Id
  });
});

/* Project Out */
router.post('/ProjectDelete',function (req,res) {
console.log('Project Delete');
	var db = req.db;
	var User_Name = req.session.User_Name;
	var User_Email = req.session.User_Email;
	var Project_Id = ObjectID(req.body.Project_Id);
	var User = db.get('User');
        var Project_Work = db.get('Project_Work');
	var Project = db.get('Project');
	var Project_Member = db.get('Project_Member');
	var Work_Comment = db.get('Work_Comment');
User.findOne({"User_Email":User_Email},function(err,user){
	if(user == null ){

	} else {
	console.log(user);
            Project_Member.col.aggregate({$match:{"Project_Id":Project_Id}},{$unwind:'$Member'},{$match:{"Member.Member_Id":user._id}},{$group:{"_id":'$_id',"User_Position":{$push:'$Member.Member_Position'}}}, function (err, position) {
	console.log(position);
	if(position == null ){

	} else {
		if(position[0].User_Position[0] == 'captin'){

		Work_Comment.remove({"Project_Id":Project_Id},function (err, data){
	
		if(data == null ){
			console.log('no data');
		} else {
			Project_Work.remove({"Project_Id":Project_Id},function(err,pro){
			if(pro == null) {
			
			} else {
				Project_Member.remove({"Project_Id":Project_Id},function(err,form){
					if(form == null ) {
			
					} else {
						Project.remove({"_id":Project_Id},function(err,suc){
							if(suc == null ){

							} else {
								res.send({Next:'project'});
							}
						});
					}
				});
			}
		    });
		  }
		});
    	    }	else {
		 //캡틴이 아닐떄 지우는 부분
		}
	}
     });	
     }
   });
 });
	







/* Select Project */
router.post('/Select_Project',function (req,res) {
console.log('선택한프로젝트입니다');
	var User_Email = req.session.User_Email;
  var User_Name = req.session.User_Name;
  var Project_Id = req.body.Project_Id;
  var db =req.db;
  var User = db.get('User');

  User.findOne({"User_Name":User_Name,"User_Email":User_Email}, function (err,data) {
    if( data == null ) {
      console.log('find error');
    } else {
      var Project_Member = db.get('Project_Member');
      Project_Member.findOne({"Project_Id":ObjectID(Project_Id)} ,function (err,member) {
        if(member == null){
          console.log('no member');
        } else {
         req.session.Project_Id = member.Project_Id;
         req.session.Project_Name = member.Project_Name;
         req.session.Project_Dday = member.Project_Dday;
         req.session.User_Name = User_Name;
         req.session.User_Email = User_Email;
         res.send({Next:'Frame'});
       }
     });
    }
  });
});

/* Project Init */
router.get('/ProjectAppend', function(req, res) {
console.log('어펜드입니다');
  var db = req.db;
  var User_Email = req.session.User_Email;
  var User_Pass = req.session.User_Pass;
  var Project_Name = new Array();
  var Project_Id = new Array();
  var Project_DueDate = new Array();
  var Project_Memo = new Array();
  var Project_Progress = new Array();
  var Project_Work_Total_Count = new Array();
  var Work_Finish = new Array();  
  var Project=db.get('Project');
  var collection = db.get('User');
  var collection2 = db.get('Project_Member');
  collection.findOne({ "User_Email" : User_Email,
   "User_Pass" : User_Pass
 }, function (err,member) {
   if(member == null) {
    console.log('false');
  }  else {
    collection2.find({ "Member.Member_Id" : member._id}, function (err,memo) {
      if(memo == null) {
        console.log('없음');
      }
      else{	
	console.log(memo);
        for(var i=0;i<memo.length;i++){
          var temp = (memo[i].Project_Dday).split('-');
          var a = new Date(temp[0],Number(temp[1])-1,temp[2]);
          var b = new Date(Date.today().getFullYear(),Date.today().getMonth(),Date.today().getDay()+1);
          Project_Name[i] = memo[i].Project_Name;
          Project_Id[i] = memo[i].Project_Id;
          Project_DueDate[i] =(a.getTime() - Date.today().getTime())/1000/60/60/24;
          Project_Memo[i] = memo[i].Project_Memo;
        }

        res.send({
          User_Email:req.session.User_Email,
          User_Name:req.session.User_Name,
          length:memo.length,
          Project_Name:Project_Name,
          Project_Id:Project_Id,
          Project_DueDate:Project_DueDate,
          Project_Memo:Project_Memo
        });
      }
    });
           }  //else 끝남
         });
});

/* Project Add */
router.post('/ProjectAdd', function (req,res) {
	var Project_Name = req.body.Project_Name;
	var Project_Dday = req.body.Project_Dday;
	var Project_Memo = req.body.Project_Memo;
	var User_Name =req.session.User_Name;
	var User_Email = req.session.User_Email;
	var db =req.db;
	var User = db.get('User');
	var Point_Item_Table = db.get('Point_Item_Table');
	console.log(User_Name);
	console.log(User_Email);
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
       Project_Member.insert({"Project_Id":data._id,"Project_Name":Project_Name,"Project_Dday":Project_Dday,"Project_Memo":Project_Memo,"Member":[{"Member_Id":member._id,"Member_Name":User_Name,"Member_Position":"captin","Member_Access":'false'}]} , function (err, doc){
         if(doc == null ) {
          console.log('member add error'); 
        } else {
	 console.log('멤버에 본인 추가');
          Point_Item_Table.insert({"Project_Id":data._id,"User_Id":member._id,"Project_Work_Total_Count":'0',
            "Person_Work_Total_Count":'0',"Finish_Work_Count":'0',"Dday_Work_Count":'0',"Comment_Count":'0',
            "UpDown_Total_Count":'0',"UpDown_Person_Count":'0',"Person_Login_Count":'0',"Team_Login_Count":'0'}, function(err,suc){
             if(suc == null){

             } else {
              res.redirect("project");
            }
          });
        }
      });
     }
   });
}
});
});

/* Image upload */
router.post('/upload',function (req, res)  {
  console.log(req.files);
  console.log(req.files.path);
  res.send( 'Success upload files' );
});

/* User List */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('User');
	collection.find({},{},function(e,docs){
   res.render('userlist',{"userlist":docs});
 });
});



//////////////////////////////////////////////////////////////////////////////
////////////////////////////////M  O B I L E//////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


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
router.post('/appprojectinit', function(req, res) {
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
      collection2.find({ "Member.Member_Id" : member._id}, function (err,memo) {
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
  Project_Db.insert({"Project_Name" : Project_Name, "Project_Dday":Project_Dday}, function (err,data){
    if(data == null){
      console.log('project insert error');
    }
    else {
      console.log('Project insert success');
      console.log(data._id);
      var User = db.get("User");
          var Project_Member = db.get("Project_Member");
          Project_Member.insert({"Project_Id":data._id,"Project_Name":data.Project_Name,"Project_Dday":data.Project_Dday,"Member":[{"Member_Id":User_Id,"Member_Name":User_Name,"Member_Position":'captin',"Member_Access":'false'}]}, function (err, member) {
            if(err){
              console.log('Project_Member error');
            } else {
              console.log('Project_Member insert success');
              res.send(member);
            }
          });
        }
      });
  });


/* APP Project Out */
router.post('/appprojectdelete',function (req,res) {
    console.log('Project Delete');
    var db = req.db;
    var User_Id = ObjectID(req.body.User_Id);
    var User_Name = req.body.User_Name;
    var User_Email = req.body.User_Email;
    var Project_Id = ObjectID(req.body.Project_Id);
    
    var Project_Work = db.get('Project_Work');
    var Project = db.get('Project');
    var Project_Member = db.get('Project_Member');
    var Work_Comment = db.get('Work_Comment');
    
    Project_Member.col.aggregate({$match:{"Project_Id":Project_Id}},{$unwind:'$Member'},{$match:{"Member.Member_Id":User_Id}},{$group:{"_id":'$_id',"User_Position":{$push:'$Member.Member_Position'}}}, function (err, position) {
        console.log(position);
        if(position == null ){

        } else {
            if(position[0].User_Position[0] == 'captin'){

                Work_Comment.remove({"Project_Id":Project_Id},function (err, data){

                    if(data == null ){
                        console.log('no data');
                    } else {
                        Project_Work.remove({"Project_Id":Project_Id},function(err,pro){
                            if(pro == null) {

                            } else {
                                Project_Member.remove({"Project_Id":Project_Id},function(err,form){
                                    if(form == null ) {

                                    } else {
                                        Project.remove({"_id":Project_Id},function(err,suc){
                                            if(suc == null ){

                                            } else {
                                                res.send({Next:'project'});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
}   else {
                 //캡틴이 아닐떄 지우는 부분
             }
         }
         

     });
});

router.post('/addprojectmember',function(req ,res) {
  var db = req.db;
  var Project_Index = req.body.Project_Index;
  var Member_Email = req.body.Member_Email;
  var User_Pass = req.body.User_Pass;
  var User_Email = req.body.User_Email;
  var Project = db.get("Project");
  var Project_Member = db.get("Project_Member");
  var User = db.get("User");
  console.log('-------------------------------------');
  console.log(Project_Index);
  console.log(Member_Email);
  console.log(User_Email);
  console.log('-------------------------------------');
  console.log(User_Email);
  User.findOne({ "User_Email" : User_Email,
    "User_Pass" : User_Pass
  }, function (err,member) {
    if(member == null) {
      console.log('false');
    }
    else {
          User.findOne({"User_Email":Member_Email},{"_id":1,"User_Name":1}, function(err, user){
            // user id, name 찾기 완료
            if(user == null){
              console.log('can not find user');
            }
            else {
        Project_Member.update({"Project_Id":ObjectID(req.body.Project_Id)},{$push:{"Member":{"Member_Id":user._id,"Member_Name":user.User_Name,"Member_Position":"crew","Member_Access":'false'}}} , function (err,member) {
		if( member == null ) {
			console.log('push error');
		} else{
			res.send({suc:"Next"});
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
/*
router.post('/projectmemberlist', function(req, res) {
  var db = req.db;
  var User_Email = req.body.User_Email;
  var User_Pass = req.body.User_Pass;
  var Project_Index = req.body.Project_Index;
  var Project_Member = db.get('Project_Member');
  var User = db.get('User');


  User.findOne({
    "User_Email": User_Email, "User_Pass": User_Pass
  }, function (err, member) {
    if (member == null) {
      console.log('false');
    }
    else {

      Project_Member.find({"Member_Id": member._id}, function (err, projectmemberinfo) {
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
*/
router.post('/appviewmemo', function(req, res){
console.log('appviewmemo');
  var Id = req.body.Project_Id;
  var User_Name = req.body.User_Name;
  var db = req.db;
  var Project_Work = db.get('Project_Work');
  var Work_Name = new Array();
  var Work_Id = new Array();
  var Work_DueDate = new Array();
  var Project_Work_Total_Count = new Array();
  var Work_Finish = new Array();

  Project_Work.find({"Project_Id":ObjectID(Id)}, function(err, memo){
	if(memo == null ) {
 
	} else  {
	console.log(memo);
	 for(var i=0;i<memo.length;i++){
          var temp = (memo[i].Work_Dday).split('-');
          var a = new Date(temp[0],Number(temp[1])-1,temp[2]);
          var b = new Date(Date.today().getFullYear(),Date.today().getMonth(),Date.today().getDay()+1);
          Work_Name[i] = memo[i].Work_Name;
          Work_Id[i] = memo[i]._id;
          Work_DueDate[i] =(a.getTime() - Date.today().getTime())/1000/60/60/24;
	console.log(Work_Name[i]);
	}
	    res.send({
		Work_Name : Work_Name,
		Work_DueDate : Work_DueDate,
		Work_Id : Work_Id,
		Work_Length : memo.length
		});
	}

  });
});



router.post('/appaddmemo', function(req, res){
  console.log('appaddmemo 시작');
  console.log(req.body);
  var Project_Id = req.body.Project_Id;
  var Work_Name = req.body.Work_Name;
  var Work_Memo = req.body.Work_Memo;
  var Work_Dday = req.body.Work_Dday;
  var Work_Finish = req.body.Work_Finish;
  var Work_Person = JSON.parse(req.body.Work_Person);

  var db = req.db;
  var Project_Work_Db = db.get('Project_Work');
  var User_Db = db.get("User");
  console.log('appaddmemo DB에 추가 시작');
      console.log('_id와 User_Id 가 매칭이 됐다');
        Project_Work_Db.insert({
          "Project_Id": ObjectID(Project_Id),
          "Work_Name": Work_Name,
          "Work_Memo": Work_Memo,
          "Work_Dday": Work_Dday,
          "Work_Finish": Work_Finish,
          "Work_Person": Work_Person
        }, function (err, data) {
          if (!err) {
            res.send(data);
          }
        });
});
router.post('/appinsertmemo', function(req, res){
  console.log('appinsertmemo 시작');
  console.log(req.body);
  var Project_Work_Id = req.body.Project_Work_Id;
  var Project_Id = req.body.Project_Id;
  var Work_Name = req.body.Work_Name;
  var Work_Memo = req.body.Work_Memo;
  var Work_Dday = req.body.Work_Dday;
  var Work_Finish = req.body.Work_Finish;
  var Work_Person = JSON.parse(req.body.Work_Person);

  var db = req.db;
  var Project_Work_Db = db.get('Project_Work');

  Project_Work_Db.update({"_id":ObjectID(Project_Work_Id)},{$set:{
    "Work_Name": Work_Name,
    "Work_Memo": Work_Memo,
    "Work_Dday": Work_Dday,
    "Work_Finish": Work_Finish,
    "Work_Person": Work_Person
  }});
 
  res.send({suc:'next'});
});

router.post('/appdeletememo', function(req, res){

  console.log('appdeletememo 시작');
  console.log(req.body);

  var Delete_MemoId = req.body.Delete_MemoId;
  var db = req.db;
  var Project_Work_Db = db.get('Project_Work');

  Project_Work_Db.remove({"_id":ObjectID(Delete_MemoId)}, function(err,doc){
    if(err){
     }
    else{
      console.log();
 
     res.send({suc:'next'});
    }
  });
});

router.post('/appshowmemo', function(req,res){
  var Project_Work_Id = req.body.Project_Work_Id;
  var db = req.db;

  var Project_Work_db = db.get('Project_Work');

  console.log('appshowmemo시작');

  console.log(Project_Work_Id);
  Project_Work_db.findOne({
    "_id":ObjectID(Project_Work_Id)}, function(err, data){
    if(err){

    }
    else
    {
      console.log(data);
      console.log('memo data뿌립니다.');
      res.send(data);
    }
  });
});
router.post('/appgetprojectmember', function(req, res){

  var Project_Id = req.body.Project_Id;
  console.log(Project_Id);
 // console.log(objectId);
  var db = req.db;
//  console.log(req);

  var Project_Member = db.get('Project_Member');
console.log('appgetprojectmember 진입');
console.log(ObjectID(Project_Id));
  Project_Member.find({"Project_Id":ObjectID(Project_Id)}, function(err, data){
    if(err){
      console.log('data가없음');
    }
    else{
      console.log('찾음');
      console.log(data);
      res.send(data);
    }

  });

});
router.post('/appaddcomment', function(req, res){

 // console.log(req.body);
  console.log('memoadd 접근!!!!!!!!!!!!!!!!!!!!!!!!');
  var Work_Comment = JSON.parse(req.body.Comment);
  var Project_Work_Id = req.body.Project_Work_Id;

  var db = req.db;
  var Work_Comment_Db = db.get('Work_Comment');
  Work_Comment_Db.insert({"Project_Work_Id":Project_Work_Id, "Work_Comment":Work_Comment}, function(err, data){
      if(!err){
        console.log('add성공!!!!!');
        res.send(data);
      }
      });
});



router.post('/appmodifycomment', function(req, res){
  console.log(req.body);
  var Insert_CommentId = req.body.Insert_CommentId;
  var New_Comment = req.body.Comment;
  console.log('수정할 코멘트 아이디');
console.log(Insert_CommentId);
console.log('수정할 코멘트');
console.log(New_Comment);

  var db = req.db;
var Work_Comment = db.get('Work_Comment');

 Work_Comment.update({"_id":ObjectID(Insert_CommentId)},{$set:{
   "Work_Comment.Comment": New_Comment
  }});
console.log('업데이트되었어요 코멘트');
res.send({suc:'next'});
});

router.post('/appdeletecomment', function(req, res){
  var Delete_CommentId = req.body.Delete_CommentId;
  console.log(Delete_CommentId);
  var db = req.db;
  var Work_Comment_Db = db.get('Work_Comment');

  Work_Comment_Db.remove({"_id":ObjectID(Delete_CommentId)}, function(err,doc){
    if(!err){
      console.log(doc);
     res.send({suc:'next'});
    }

  });


});
router.post('/appgetcomment', function(req, res){
 var Project_Work_Id = req.body.Project_Work_Id;
  var db = req.db;
  var Work_Comment_Db = db.get('Work_Comment');
  console.log('memoget 접근');
  console.log(Project_Work_Id);
  Work_Comment_Db.find({"Project_Work_Id":Project_Work_Id}, function(err, data){
    if(!err){
      console.log(data);
      res.send(data);
    }
  })
});
module.exports = router;
