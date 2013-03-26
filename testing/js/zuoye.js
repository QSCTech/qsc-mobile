// 此文件尚未重构，等待新的作业api
function loadZuoyeAll() {
    (function() {
        var siteUrl = 'http://m.myqsc.com/php-stable/index.php';
        var zuoYeData = localStorage.getItem(stuid+'zuoYeKeep') ? JSON.parse(localStorage.getItem(stuid+'zuoYeKeep')) : [];

        var timestamp = localStorage.getItem(stuid+'zuoYeLastPullKeep') ? localStorage.getItem(stuid+'zuoYeLastPullKeep') : 0;

        $.jsonP({url:siteUrl+'/jsonp/zuoye'+'?stuid='+stuid+'&pwd='+pwd+'&last_timestamp='+timestamp+'&callback=?',
                 success:function(data) {
                     if(data) {
                         var k;
                         for(k=0; k<data.length; k++) {
                             var item = data[k];
                             zuoYeData.push({"content":Base64.decode64(item.content), "done": false, "courseHash":item.course_id_md5, "hashId":item.hash_id, "course":item.course_name});
                         }
                         //处理新的data，合并到原先的zuoyedata
                         //zuoYeData = data;
                         localStorage.setItem(stuid+'zuoYeKeep', JSON.stringify(zuoYeData));
                         var now = new Date();
                         timestamp = parseInt(now.getTime() / 1000);
                         localStorage.setItem(stuid+'zuoYeLastPullKeep', timestamp)
                     }
                     loadZuoYe();
                 },
                 error:function(){
                     loadZuoYe();
                 }
                });

        if(typeof(kebiaoData) != "undefined") {
            genHomeworkCourse();
        } else if (localStorage.getItem('keBiao')) {
            kebiaoData = JSON.parse(localStorage.getItem('keBiao'));
            genHomeworkCourse();
        } else {
            myGetJsonp('kebiao', true, function(data) {
                if(data) {
                    kebiaoData = data;
                    localStorage.setItem('keBiao', JSON.stringify(kebiaoData));
                    genHomeworkCourse();
                }
            });
        }
        function genHomeworkCourse() {
            // 生成add_homework里的course
            var html = '';
            for(var i=0; i<kebiaoData.length; i++) {
                var item = kebiaoData[i];
                html += '<option value="'+item.course_id_md5+'@@@'+item.name+'">'+item.name+'</option>';
                $('#add_homework_course').html(html);
            }
        }

        var shareHomework = true;


        function loadZuoYe(changeId) {
            var donehtml = '';
            var todohtml = '';

            for(var i=zuoYeData.length - 1; i>-1; i--) {
                var item = zuoYeData[i];

                if(item.hashId == changeId) {
                    zuoYeData[i].done = !zuoYeData[i].done;
                    localStorage.setItem(stuid+'zuoYeKeep', JSON.stringify(zuoYeData));
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

            $('#clear_homework_log').bind('click', function() {
                if(confirm('确认清空作业?') == true) {
                    $('#zuoye_list').html('');
                    var zuoYeData = [];
                    localStorage.setItem(stuid+'zuoYeKeep', zuoYeData);
                }
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
                localStorage.setItem(stuid+'zuoYeKeep', JSON.stringify(zuoYeData));

                // 隐藏表单
                $('#add_homework').attr('class', 'hide');

                // 刷新DOM
                loadZuoYe();

                // 若分享则提交服务器端
                if(homework_share) {
                    var target = siteUrl+'/jsonp/submit_homework'+'?hash_id='+hashId+'&last_timestamp='+last_timestamp+'&content='+homework_content_base64+'&assign_time='+assign_time+'&course_name='+course_name+'&course_id_md5='+course_id_md5+'&stuid='+stuid+'&pwd='+pwd;
                    (new Image()).src = target;
                }
            });
        });
    })();
}
