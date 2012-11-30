var zuoYeData;

$.jsonP({url:siteUrl+'/jsonp/zuoye'+'?stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?',
         success:function(data) {
             if(!data) return;
             zuoYeData = data;
             localStorage.setItem('zuoYe', JSON.stringify(zuoYeData));
             loadZuoYe();
         },
         error:function(){
             if (localStorage.getItem('zuoYe')) {
                 zuoYeData = JSON.parse(localStorage.getItem('zuoYe'));
                 loadZuoYe();
             }
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
    var html = '';
    for(var i=0; i<keBiaoData.length; i++) {
        var item = keBiaoData[i];
        html += '<option value="'+item.course_id_md5+'">'+item.name+'</option>';
        $('#add_homework_course').html(html);
    }
}

var shareHomework = true;

$(document).ready(function(){

    $('#share_homework').attr('class', shareHomework);

    $('#add_homework_button').bind('click', function() {
        $('#add_homework').toggle();
        document.getElementById('add_homework_textarea').focus();
    });

    $('#share_homework').bind('click', function() {
        shareHomework = !shareHomework;
        $('#share_homework').attr('class', shareHomework);
    });

    $('#add_homework_submit').bind("click", function() {
        var homework_content = $('#add_homework_textarea').val();
        homework_content = Base64.encode64(homework_content);

        var homework_share = $('#share_homework').attr('class');
        var course_id_md5 = $('#add_homework_course').val();

        var now = new Date();
        var assign_time = parseInt(now.getTime() / 1000);

        $.jsonP({url:siteUrl+'/jsonp/submit_homework'+'?content='+homework_content+'&assign_time='+assign_time+'&course_id_md5='+course_id_md5+'&stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?',
                 success:function(data) {
//                     myShowMsg('好的嘛，提交成功');
                 },
                 error:function(){
                     myShowMsg('好的嘛，分享失败……');
                 }
                });

    });
});

function loadZuoYe() {
    var html = '';
    for(var i=0; i<zuoYeData.length; i++) {
        var item = zuoYeData[i];
        html += '<li></li>';
    }
}
