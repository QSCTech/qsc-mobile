function myGetJsonp(name, showMsg, callback, getArray) {
    if(!navigator.onLine) {
        myShowMsg('好的嘛，这是已经离线的节奏……');
        return;
    }

    if(showMsg)
      $('#loading').show(100);

    if(!pwd)
      pwd = '';

    var myJsonpUrl = siteUrl+'/jsonp/'+name+'?stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?';

    $.jsonP({url:myJsonpUrl,
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
    var request_count = 3;

    if(showDone) {
        var request_done_check = setInterval(function(){
            if(request_count !== 0)
	      return;

            myShowMsg('好的嘛，请求完毕');
            clearInterval(request_done_check);
        }, 10);
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
    myGetJsonp('calendar', false, function(data) {
        if(!data) return;
        localStorage.setItem('xiaoLi', JSON.stringify(data));
        request_count--;
    });

    // 下面的需要登录
    if(isLogin) {
        request_count += 4;

        myGetJsonp('kebiao', false, function(data) {
            if(!data) return;
            localStorage.setItem('keBiao', JSON.stringify(data));
            request_count--;
        });
        myGetJsonp('notice', false, function(data) {
            if(!data) return;
            localStorage.setItem('notice', JSON.stringify(data));
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
        $('#menu').hide();
        $('#login').show();
        $.include(['BigInt.js','Barrett.js','RSA.js']);

        $('#login_submit').bind("click", function(){
            stuid = $("#stuid").val();

            var rsa_n = "AA18ABA43B50DEEF38598FAF87D2AB634E4571C130A9BCA7B878267414FAAB8B471BD8965F5C9FC3818485EAF529C26246F3055064A8DE19C8C338BE5496CBAEB059DC0B358143B44A35449EB264113121A455BD7FDE3FAC919E94B56FB9BB4F651CDB23EAD439D6CD523EB08191E75B35FD13A7419B3090F24787BD4F4E1967";
            setMaxDigits(131); //131 => n的十六进制位数/2+3
            var key      = new RSAKeyPair("10001", '', rsa_n); //10001 => e的十六进制
            pwd = $("#pwd").val();
            pwd = encryptedString(key, pwd); //不支持汉字

            myGetJsonp('validate', true, function(data) {
                if(data['stuid'] != '') {
                    token = data['token'];

                    localStorage.setItem('stuid', stuid);
                    localStorage.setItem('pwd', pwd);
                    localStorage.setItem('token', token);
                    localStorage.setItem('isLogin', true);
                    isLogin = true;
                    $('#login').hide(200);

                    $('#menu .user').attr('class', 'box user logout');
                    $('#menu .user').html('注销');

                    // 回调函数
                    if(typeof(callback) == 'function') {
                        callback();
                    }

                } else {
                    localStorage.setItem('isLogin', false);
                    isLogin = false;
                    myShowMsg('登录失败');
                }
            });
        });
    }
}
