  $.getJSON('/getProjectId', function (data) {
      var User_Name = data.User_Name;
      var Project_Id = data.Project_Id;
      var socket = io();
      var Time = new Date();
socket.on('connect',function(){  
      socket.emit('join', {
         User_Name : User_Name,
         Project_Id : Project_Id,
      });
      socket.emit('getgreet', User_Name +'님이 접속하셨습니다.');


    socket.on('Disconnect_Member', function(data) {
                var DisConnect_Dataform = JSON.stringify(data);
                var DisConnect_User = '';
                   var DisConnect = JSON.parse(DisConnect_Dataform);
                   var DisConnect_Count = DisConnect.length;
                   
                   var DisConnect_List = [];
                   for( var i =0;i<DisConnect_Count;i++){           
                        DisConnect_List.push({'user' : DisConnect[i].Member});
                        }
          
               
               $.each(DisConnect_List, function(index, item){
                  DisConnect_User += "<li>"  +item.user + "<br></li>"; 
               });
               $('#nonaccess_user').empty();
                $('#nonaccess_user').append(DisConnect_User);
                DisConnect_User = '';
                DisConnect_List = '';

	});
 socket.on('Connect_Member', function(data){                
                var Connect_Dataform = JSON.stringify(data);
                var Connect_User = '';               
                   var Connet = JSON.parse(Connect_Dataform);
                   var count = Connet.length;
                   
                   var Connect_List = [];
                   for( var i =0;i<count;i++){
                        Connect_List.push({'user' : Connet[i].Member});
                        }                     
               $.each(Connect_List, function(index, item){
                  Connect_User += "<li>"  +item.user + "<br></li>"; 
               });
               $('#access_user').empty();
                $('#access_user').append(Connect_User);
                Connect_User = '';
                Connect_List = '';
             });
                         


      $('form').submit(function(){
         var message =$('#m').val();
	 var current_time = Time.getHours() + ":" + Time.getMinutes();
         socket.emit('getmessage', {
	    message: message,
            User_Name:User_Name,
	    Time : current_time
	    });
         $('#m').val('');
         return false;
      });


       socket.on('premessage', function(data){
              
                 if(data.Member == User_Name){
                    $('#messages').append($('<span style="font-size:20pt; float:right;">').text(data.message));
                    $('#messages').append($('<span style="font-size:10pt; float:right;">').text(data.Time+' '));
                    $('#messages').append($('</span></span><br><br>'));
                 }
                 else
                 {
                    $('#messages').append($('<span style="font-size:15pt; float:left;">').text(data.User_Name+' '));
                    $('#messages').append($('<span style="font-size:20pt; float:left;">').text(data.message+' '));
                    $('#messages').append($('<span style="font-size:10pt; float:left;">').text(data.Time));
                    $('#messages').append($('</span></span></span><br><br>'));
                 }
                     var el = document.getElementById('messages');
                      el.scrollIntoView(false);
                  });





      socket.on('putgreet', function(msg){
         $('#messages').append($('<h4 align="center">').text(msg));
      });
        socket.on('putmessage',function(data) {
                                 if (data.User_Name == User_Name) {
                                    var text = '';
                                    text += "<div>";
                                    text += "<span style='display:inline-block; .display:inline; float: right; border: 1px solid blue; margin:auto width:auto'>"
                                          + data.message
                                          + "</span>";
                                    text += "<span style='display:inline-block; .display:inline; float: right; margin:auto width:auto'><sub>"
                                          + data.Time
                                          + "</sub></span>";
                                    text += "</div><p>&nbsp;</p>";
                                    $('#messages').append(text);

                                 } else {
                                    var text = '';
                                    text += "<div>";
                                    text += "<span style='display:inline-block; .display:inline; float: left; border: 1px solid red; margin:auto width:auto;'>"
                                          + data.User_Name
                                          + ':'
                                          + "</span>";
                                    text += "<span style='display:inline-block; .display:inline; float: left; border: 1px solid red; margin:auto width:auto;'>"
                                          + data.message
                                          + "  </span>";
                                    text += "<span style='display:inline-block; .display:inline; float: left; margin:auto width:auto;'><sub>"
                                          + data.Time
                                          + "</sub></span>";
                                    text += "</div><p>&nbsp;</p>";
                                    $('#messages').append(text);

                                 }
                                 var el = document
                                       .getElementById('messages');
                                 el.scrollIntoView(false);
                              });
//scroll 아래로 내리기
         var el = document.getElementById('messages');
         el.scrollIntoView(false);
      });
    });
   });
