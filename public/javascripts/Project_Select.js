 var Project_Name = new Array();
 var Project_Id = new Array();
 var Project_DueDate = new Array();
 var Project_Progress = new Array();
 var Project_Memo = new Array();
 var count;
 var User_Name;
 var User_Email;
 var prjId = 0;
 var btnId = 0;
$.getJSON('/Project_Create', function(data) {
   count = data.length;
   User_Name = data.User_Name;
   User_Email = data.User_Email;
   for (var j = 0; j < count; j++) {
      Project_Name[j] = data.Project_Name[j];
      Project_Id[j] = data.Project_Id[j];
      Project_DueDate[j] = data.Project_DueDate[j];
  //    Project_Progress[j] = data.Project_Progress[j];
      Project_Memo[j] = data.Project_Memo[j];
   }
   prepare();
});

function prepare() {
   $(document).ready(function() {
      //var name = '박망고';
      var name = User_Name;
      $('#user').text(name);
      // 데이터베이스에서 참여하고있는 프로젝트 목록을 읽어옵니다.
      var list = [];
    for (var i = 0; i < count; i++) {
         list.push({
            title : Project_Name[i],
            duedate : Project_DueDate[i],
   //         progress : Project_Progress[i],
            memo : Project_Memo[i]
         });
      }
      var text = "";
      $.each(list, function(index, item) {
         // text += "<br><a class='prj' id='" + prjId + "'><br>" + item.title + "<br></a><div class='tt' id='" +btnId+"'><input type ='button' value='나가기'></div>";
         text += "<div class='prj'><span class='title' id ='"+prjId+"'>" + item.title + "</span>";
         text += "<div class='detail'>";
         text += "<div><span>" + item.duedate + "</span>";
         text += "<span>" + item.memo + "</span></div>";
         text += "<div><span>" + item.memo + "</span>";
         text += "<img class='del'  id='" + btnId + "' src='../images/delete.png'></div>";
         text += "</div></div>";
         prjId++;
         btnId++;
      });
      // 프로젝트 추가 이미지
      text += "<div class='prj'><a data-toggle='modal' href='#myModal' data-role='add'>";
      text += "<img id='prj_add' src='../images/prj_add.png'></a></div>";
//	$('#wrap').append(text);
      var box = document.getElementById('wrap');
      box.innerHTML = text;
      // prj_list에 text를 덧붙입니다.
   });


   $('.prj').mouseover(function() {
      var box = $(this).children('.detail');
      var title = $(this).children('.title');
      box.css('display', 'inline-block');
      title.css('font-size', '43px');
      title.css('font-weigth', 'bold');
   });
   $('.prj').mouseout(function() {
      var box = $(this).children('.detail');
      var title = $(this).children('.title');
      box.css('display', 'none');
      title.css('font-size', '24px');
      title.css('font-weigth', 'normal');
   });


// 프로젝트 삭제 버튼 클릭 시
$(document).on("click", ".del", function() {
   alert(this.id);
   $.ajax({
      url : '/projectout',
      dataType : 'json',
      type : 'POST',
      data : {
         'Project_Index' : this.id,
      },
      success : function(result) {
         window.location.reload();
      }
   });
});

// 프로젝트 선택 시
$(document).on("click", ".title", function() {
	alert(this.id);
   $.ajax({
      url : '/findProjectId',
      dataType : 'json',
      type : 'POST',
      data : {
         'Project_Index' : this.id,
         //프로젝트 내용
      },
      success : function(result) {
         window.location = result.Next;
      }
   });
});

}