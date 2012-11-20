$.extend({
    // 封装的include_once
    // $.include(['json2.js', 'jquery.tree.js', 'jquery.tree.css']);
    include: function(files) {
        outerLoop:
        for(var i=0; i< files.length; i++){
            var scriptNode = document.createElement('script');
            scriptNode.src = 'js/'+files[i];

            var scripts = document.getElementsByTagName('script');
            for(var j=0; j<scripts.length; j++){
                if(scripts[j].src == scriptNode.src){
                    break outerLoop; // file already exists
                }
            }
            document.head.appendChild(scriptNode);
        }
    }
});

$.includePath = 'js/';

//var siteUrl = 'http://localhost/qsc-mobile-back/index.php';
var siteUrl = 'http://m.myqsc.com/dev3/mobile2/index.php';

// 在phonegap下出错
// window.addEventListener('offline', function() {
//     myShowMsg('好的嘛，这是掉线的节奏……');
// });
// window.addEventListener('online', function() {});

// 读取用户信息
var stuid = localStorage.getItem('stuid',false) ? localStorage.getItem('stuid') : false;
var pwd = localStorage.getItem('pwd',false) ? localStorage.getItem('pwd') : false;
var isLogin = localStorage.getItem('isLogin',false) ? localStorage.getItem('isLogin') : false;
var token = localStorage.getItem('token',false) ? localStorage.getItem('token') : false;

// 初始化用户配置
// 默认关闭自动给老师好评
var config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {'evaluate_teacher_automatically':false};
var config_list = ['update_automatically', 'evaluate_teacher_automatically'];
for(var i = 0; i < config_list.length; i++) {
    var item = config_list[i];
    if(typeof(config[item]) == "undefined")
	config[item] = true; // 默认开启特性
}


function pleaseLoginIfNotLogin(callback) {
    if(isLogin) {
        if(typeof(callback) == 'function') {
            callback();
        }
    } else {
        $('#login').show(200);
        $.include(['BigInt.js','Barrett.js','RSA.js']);

        $('#login_submit').bind("mouseover", function(){
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


// 读取教务部数据：单双周、学期之类
var jwbData;
if(localStorage.getItem('jwbData')) {
    jwbData = JSON.parse(localStorage.getItem('jwbData'));
} else {
    myGetJsonp('jwbdata', true, function(data) {
        jwbData = data;
        localStorage.setItem('jwbData', JSON.stringify(data));
    });
}

$(document).ready(function() {

    if(isLogin) {
        $('#menu .user').attr('class', 'box user logout');
        $('#menu .user').html('注销');
    } else {
        $('#menu .user').attr('class', 'box user login');
        $('#menu .user').html('登录');
    }

    $('#msg .close').bind("mouseover", function(){
        $('#msg').hide(800);
        return false;
    });

    $('.logo').bind("mouseover", function(){
        $(this).parent().hide();
        $('#menu').show();
        return false;
    });

    $('.backward').bind("mouseover", function(){
        $(this).parent().parent().hide(200);

        // 设置延迟，防止鼠标事件被意外传递（opera mobile）
        setTimeout(function() {
            $('#menu').show()
        }, 10);
        return false;
    });

    $('#menu .kebiao').bind("mouseover", function(){
        $('#menu').hide(200);
        pleaseLoginIfNotLogin(function() {
            $('#kebiao').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
        return false;
    });

    $('#menu .config').bind("mouseover", function(){
        $('#menu').hide(200);
        $('#config').show(200);
        $.include(['qsc-mobile-config.js']);
        return false;
    });

    $('#menu .xiaoche').bind("mouseover", function(){
        $('#menu').hide(200);
        $('#xiaoche').show(200);
        $.include(['qsc-mobile-bus.js']);
        return false;
    });

    $('#menu .xiaohua').bind("mouseover", function(){
        $('#menu').hide(200);
        $('#xiaohua').show(200);
        $.include(['qsc-mobile-xiaohua.js']);
        return false;
    });

    $('#menu .gaikuang').bind("mouseover", function(){
        $('#menu').hide(200);
        pleaseLoginIfNotLogin(function() {
            $('#gaikuang').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
        return false;
    });

    $('#menu .kaoshi').bind("mouseover", function(){
        $('#menu').hide(200);
        pleaseLoginIfNotLogin(function() {
            $('#kaoshi').show(200);
            $.include(['qsc-mobile-kaoshi.js']);
        });
        return false;
    });

    $('#menu .chengji').bind("mouseover", function(){
        $('#menu').hide(200);
        pleaseLoginIfNotLogin(function() {
            $('#chengji').show(200);
            $.include(['qsc-mobile-chengji.js']);
        });
        return false;
    });

    $('#menu .update').bind("mouseover", function(){
        myShowMsg('更新中……');
        getAllJsonp(true);
        return false;
    });


    $('#menu .login').bind("mouseover", function(){
        $('#menu').hide(200);
        pleaseLoginIfNotLogin(function() {
            $('#config').show(200);
            $.include(['qsc-mobile-config.js']);
        });
        return false;
   });

    $('#menu .logout').bind("mouseover", function(){
        var stuid = '';
        var pwd = '';
        var isLogin = false;
        // 清空localStorage
        localStorage.clear();
        myShowMsg('注销成功', function(msg) {
            // 刷新以重载js以及到dom
            setTimeout(function() {
  		window.location.reload();
            }, 1000);
        });
        return false;
    });
});




// 自动更新数据
if(config.update_automatically) {
    getAllJsonp();
}
