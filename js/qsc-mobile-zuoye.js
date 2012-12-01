var zuoYeData = localStorage.getItem('zuoYe') ? JSON.parse(localStorage.getItem('zuoYe')) : [];

$.jsonP({url:siteUrl+'/jsonp/zuoye'+'?stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?',
         success:function(data) {
             if(data) {
                 console.log(data);
                 //处理新的data，合并到原先的zuoyedata
                 //zuoYeData = data;
                 //localStorage.setItem('zuoYe', JSON.stringify(zuoYeData));
             }
             loadZuoYe();
         },
         error:function(){
             loadZuoYe();
         }
        });

if(typeof(keBiaoData) != "undefined") {
    // already defined
    genHomeworkCourse();
} else if (localStorage.getItem('keBiao')) {
    keBiaoData = JSON.parse(localStorage.getItem('keBiao'));
    genHomeworkCourse();
} else {
    myGetJsonp('kebiao', true, function(data) {
        if(data) {
            keBiaoData = data;
            localStorage.setItem('keBiao', JSON.stringify(keBiaoData));
            genHomeworkCourse();
        }
    });
}
function genHomeworkCourse() {
    // 生成add_homework里的course
    var html = '';
    for(var i=0; i<keBiaoData.length; i++) {
        var item = keBiaoData[i];
        html += '<option value="'+item.course_id_md5+'@@@'+item.name+'">'+item.name+'</option>';
        $('#add_homework_course').html(html);
    }
}

var shareHomework = true;


//for test
loadZuoYe();


function loadZuoYe(changeId) {
    var donehtml = '';
    var todohtml = '';

    for(var i=zuoYeData.length - 1; i>-1; i--) {
        var item = zuoYeData[i];

        if(item.hashId == changeId) {
            zuoYeData[i].done = !zuoYeData[i].done;
            localStorage.setItem('zuoYe', JSON.stringify(zuoYeData));
        }

        var done = item.done ? 'done' : 'todo';
        var li = '<li id="'+item.hashId+'" class="'+done+'"><div class="content">'+item.content+'</div><div class="course">'+item.course+'</div></li>';

        if(item.done)
          donehtml += li;
        else
          todohtml += li;
    }
    $('#zuoye_list').html(todohtml+donehtml);
}


$(document).ready(function(){

    $('#zuoye').on('click', 'li', function() {
        var changeHashId = $(this).attr('id');
        loadZuoYe(changeHashId);
    });


    $('#share_homework').attr('class', shareHomework);

    // $('#add_homework_button').bind('click', function() {
    //     $('#add_homework').toggle();
    //     document.getElementById('add_homework_textarea').focus();
    // });

    $('#share_homework').bind('click', function() {
        shareHomework = !shareHomework;
        $('#share_homework').attr('class', shareHomework);
    });

    $('#add_homework_submit').bind("click", function() {
        var homework_content = $('#add_homework_textarea').val();

        if (!homework_content)
          return;

        var homework_content_base64 = encodeURIComponent(Base64.encode64(homework_content));

        var homework_share = $('#share_homework').attr('class');

        var course_info = $('#add_homework_course').val().split('@@@');
        var course_id_md5 = course_info[0];
        var course_name = course_info[1];

        var now = new Date();
        var assign_time = parseInt(now.getTime() / 1000);

        // for test
        var last_timestamp = 0;

        var hashId = 'STAMP'+stuid+now.getTime();

        // 存入localStroage
        zuoYeData.push({"content":homework_content, "done": false, "courseHash":course_id_md5, "hashId":hashId, "course":course_name});
        localStorage.setItem('zuoYe', JSON.stringify(zuoYeData));

        // 隐藏表单
        $('#add_homework').attr('class', 'hide');

        // 刷新DOM
        loadZuoYe();

        // 若分享则提交服务器端
        if(homework_share) {
            $.jsonP({url:siteUrl+'/jsonp/submit_homework'+'?hash_id='+hashId+'&last_timestamp='+last_timestamp+'&content='+homework_content_base64+'&assign_time='+assign_time+'&course_id_md5='+course_id_md5+'&stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?',
                     success:function(data) {
                         //                     myShowMsg('好的嘛，提交成功');
                     },
                     error:function(){
                         myShowMsg('好的嘛，分享失败……');
                     }
                    });
        }
    });
});
