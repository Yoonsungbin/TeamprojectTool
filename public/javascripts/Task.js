$.getJSON('/TaskAppend', function(data) {
       var dataform = JSON.stringify(data);
	var temp = JSON.parse(dataform);
//	alert(temp);
	var count = data.length;
	       var Work_Name = new Array();
               var Work_Dday = new Array();
               var Work_Memo = new Array();
              // var Work_Person = new Array();
               var Work_Top = new Array();
               var Work_Left = new Array();
               var Work_Finish = new Array();
               var Work_List = new Array();
	       var Work_Id = new Array();
	for(var i =0;i<count;i++){
                     Work_List.push({
                        'Id' : temp[i]._id,
                        'Name' : temp[i].Work_Name,
                        'Dday' : temp[i].Work_Dday,
                        'Memo' : temp[i].Work_Memo,
                        'Person' : temp[i].Work_Person.User_Name,
                        'Top' : temp[i].Work_Top,
                        'Left' : temp[i].Work_Left,
                        'Finish' : temp[i].Work_Finish
                     });
                  }
	var text = "";

            $.each(Work_List, function(index, item) {
               text += "<div class ='card' id='" + item.Id + "' style='top:"+item.Top+"; left:"+item.Left+";'>";
               text += "<div class='card-content'>";
               text += "할 일 이름 : " + item.Name;
               text += "<br>마감일 : " + item.Dday;
               text += "<br>담당자 : " + item.Person;
               text += "<br>내용 : " + item.Memo;
              text += "</div></div>";
            });

            $('body').append(text);
            $('.card').draggable({
               grid : [205, 140]
            });
	});
///////////////////////////////////////////
/////////////////////////라벨

$.getJSON('/LavelAppend',function(data){
   var dataform = JSON.stringify(data);
   var temp = JSON.parse(dataform);
   var Lavel_List = new Array();
//   alert(temp);
   var count = data.length;
      for(var i =0; i < count; i++){
         Lavel_List.push({
            'Id' : temp[i]._id,
            'Name' : temp[i].Lavel_Name,
            'Top' : temp[i].Lavel_Top,
            'Left' : temp[i].Lavel_Left
         });
      }
      var ltext = "";
               $.each(Lavel_List, function(index, item) {
                  ltext += "<div class ='label' id ='" +item.Id +"' style ='top :"+item.Top+"; left:"+item.Left+";'>";
                  ltext += item.Name;
                  ltext += "</div>";
               });

                  $('body').append(ltext);

               $('.label').draggable({
                  grid : [205, 140]
               });
   });



$(document).on("click",".card",function(){
//   $('.card').click(function() {
		  var x = event.pageX - event.offsetX;
		  var y = event.pageY - event.offsetY;
$.ajax({
	url: '/Get_TaskData',
	dataType : 'json',
	type :'POST',
	data :  {
	'Work_Id' : this.id,
	'x' : x,
	'y' : y
	},
	success : function (result){
		//move save 뎀
	}
});

$(document).on("dblclick",".card",function(){
$.ajax({
  	url: '/Update_TaskData',
  	dataType : 'json',
  	type :'POST',
  	data :  {
     'Work_Id' : this.id,
     'x' : x,
     'y' : y
   },
   success : function (result){
      var Work_List = [];
      var dataform = JSON.stringify(result);
      var temp = JSON.parse(dataform);
      Work_List.push({
        'Id' : temp._id,
        'Name' : temp.Work_Name,
        'Dday' : temp.Work_Dday,
        'Memo' : temp.Work_Memo,
        'Person' : temp.Work_Person.User_Name,
        'Top' : temp.Work_Top,
        'Left' : temp.Work_Left,
        'Finish' : temp.Work_Finish
      });
      var text = "";
      
      $.each(Work_List, function(index, item) {
       text += "할 일 이름 : " + item.Name;
       text += "<br>마감일 : " + item.Dday;
       text += "<br>담당자 : " + item.Person;
       text += "<br>내용 : " + item.Memo;
     });

      $('#taskModal').modal('show');
      var box = document.getElementById('bb');
      box.innerHTML = text;
    }
  });
});
});
//$(document).on("mouseup",".card",function(){
//	alert('aaa');

//});


        
