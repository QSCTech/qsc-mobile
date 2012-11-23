function myGetJsonp(name, showMsg, callback) {
    if(!navigator.onLine) {
        myShowMsg('好的嘛，这是已经离线的节奏……');
        return;
    }

    if(showMsg)
      $('#loading').show(100);

    if(!pwd)
      pwd = '';

    $.jsonP({url:siteUrl+'/jsonp/'+name+'?stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?',
             success:function(data){
                 if(typeof(data['code']) != "undefined") {
                     if(data['code'] == 0) {
                         // 远端返回错误
                         myShowMsg(data['msg']);
                         return;
                     }
                     if(data['code'] == 1) {
                         // 远端返回消息
                         myShowMsg(data['msg']);

                         // 再次访问远端来获取内容（递归）
                         myGetJsonp(name, callback);
                     } else {
                         // 未知情况
                         return;
                     }
                 }

                 if(showMsg)
                   $('#loading').hide(100);

                 // 回调函数
                 if(typeof(callback)=='function'){
                     callback(data);
                 };
             },
             error:function(){
                 if(!showMsg) return;

                 $('#loading').hide(100);
                 myShowMsg('好的嘛，获取数据失败……');
             }
            });
}
function myShowMsg(msg, callback) {
    $('#loading').hide();// 既然显示消息就不必显示loading了

    $('#msg').show(200);
    $('#msg .content').html(msg);

    // 回调函数
    if(typeof(callback)=='function'){
        callback(msg);
    };
}
function getAllJsonp(showDone){
    var request_count = 2;
    if(showDone) {
        var request_done_check = setInterval(function(){
            if(request_count !== 0)
	      return;

            myShowMsg('好的嘛，请求完毕');
            clearInterval(request_done_check);
        });
    }

    myGetJsonp('jwbdata', false, function(data) {
        if(!data) return;
        localStorage.setItem('jwbData', JSON.stringify(data));
        request_count--;
    });
    myGetJsonp('xiaoche', false, function(data) {
        if(!data) return;
        localStorage.setItem('xiaoChe', JSON.stringify(data));
        request_count--;
    });

    // 下面的需要登录
    if(isLogin) {
        request_count += 3;

        myGetJsonp('kebiao', false, function(data) {
            if(!data) return;
            localStorage.setItem('keBiao', JSON.stringify(data));
            request_count--;
        });
        myGetJsonp('chengji', false, function(data) {
            if(!data) return;
            localStorage.setItem('chengJi', JSON.stringify(data));
            request_count--;
        });
        myGetJsonp('kaoshi', false, function(data) {
            if(!data) return;
            localStorage.setItem('kaoShi', JSON.stringify(data));
            request_count--;
        });
    }
}
function pleaseLoginIfNotLogin(callback) {
    if(isLogin) {
        if(typeof(callback) == 'function') {
            callback();
        }
    } else {
        // 重定向到login.html
        // localstroage记下callback
        window.location.href="login.html";
    }
}
$(document).ready(function() {
    $('#msg .close').bind("click", function(){
        $('#msg').hide(800);
        return false;
    });
});