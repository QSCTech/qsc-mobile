var siteUrl = 'http://m.myqsc.com/php-dev/index.php';
//var siteUrl = 'http://m.myqsc.com/php-stable/index.php';

var version = 'QSC Mobile Build 20121218.8X';

function myGetJsonp(name, showMsg, callback, getArray) {
    if(!navigator.onLine) {
        myShowMsg('好的嘛，这是已经离线的节奏……');
        return;
    }

    if(showMsg)
      $('#loading').show();

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
                 myShowMsg('好的嘛，断网了吧？');
             }
            });
}
function myShowMsg(msg, callback) {
    $('#loading').hide();// 既然显示消息就不必显示loading了

    $('#msg').show();
    $('#msg .content').html(msg);

    // 回调函数
    if(typeof(callback)=='function'){
        callback(msg);
    };
}
function getAllJsonp(showDone, callback) {
    var request_count = 3;

    if(showDone) {
        var request_done_check = setInterval(function(){
            if(request_count !== 0)
	      return;

            myShowMsg('好的嘛，请求完毕');
            clearInterval(request_done_check);

            if(typeof(callback)=='function'){
                callback();
            };
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
        $(currentLayout).hide();
        $('#login').show();
        $.include(['BigInt.js','Barrett.js','RSA.js']);

        $('#login_form').bind("submit", function(){
            stuid = $("#stuid").val();

            // new rsa key
            var rsa_n = "B31C73F556614A46E1405B116264A60039ACF9A33F45C121C9ED3A9CDF743566D82FFE73623941C629BFAA9EDFD8B4B5944954FABAB2795D0B09787990562C17400EEB12E5AFCC7D4707B589708F09EE878742113D3CBDD41A8BA5455FB558DBD2A5BEADF739389A953687FD4E1113E68DC48C97346EF7930ECCF7743E2FFB9D";
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

            return false;
        });
    }
}

//储存全局script的src元素，不包括JSONP
var globalScripts = {};

//自定义jQuery.include方法，实现include once功能
//$.inlcude(['file1', 'file2', ...]);
$.extend({
    include: function(files) {
        for (var i=0; i<files.length; i++) {
            var file = files[i];
            if ( typeof(globalScripts["js/" + file]) == "undefined" ) {
                var scriptNode = document.createElement("script");
                globalScripts["js/" + file] = true;
                scriptNode.src = "js/" + file;
                document.head.appendChild(scriptNode);
            }
        }
    }
});



// 读取用户信息
var stuid = localStorage.getItem('stuid',false) ? localStorage.getItem('stuid') : false;
var pwd = localStorage.getItem('pwd',false) ? localStorage.getItem('pwd') : false;
var isLogin = localStorage.getItem('isLogin',false) ? localStorage.getItem('isLogin') : false;
var token = localStorage.getItem('token',false) ? localStorage.getItem('token') : false;

var config;
var config_list;
// 初始化用户配置
// 默认关闭自动给老师好评
function loadConfig() {
    config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {};
    config_list = ['update_automatically', 'evaluate_teacher_automatically', 'gaikuang_as_default'];
    for(var i = 0; i < config_list.length; i++) {
        var item = config_list[i];
        if(typeof(config[item]) == "undefined")
          config[item] = false; // 默认关闭特性
    }
}
loadConfig();

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

// 存储当前处于哪个界面，方便返回时选取
var currentLayout = '#menu';
// 清除hash，进入默认界面
window.location.hash = '';

$(document).ready(function() {

    $('#version').html(version);

    // 监听hashchange，处理后退、前进（不支持老旧浏览器）
    // 除登陆外所有跳转均需通过修改 window.location.hash 来实现
    $(window).on("hashchange", function(){
        if (window.location.hash == '') {
            // 返回主界面
            $(currentLayout).hide(200);

            // 设置延迟，防止鼠标事件被意外传递（opera mobile）
            setTimeout(function() {
                $('#menu').show()
            }, 10);
            currentLayout = '#menu';
        } else {
            $(currentLayout).hide();
            $(window.location.hash).show();
            currentLayout = window.location.hash;
        }
    });

    // 加入已有script
    $("script").each(function (index, element) {
        var src = $(element).attr("src");
        if ( src.indexOf("js/") == 0 ) {
            globalScripts[src] = true;
        }
    });



    $('.logo').bind("click", function(){
        $(this).parent().hide();
        $('#menu').show();
        return false;
    });

    $('.backward').bind("click", function(){
        window.history.back();
        return false;
    });

    $('#menu .kebiao').bind("click", function(){

        pleaseLoginIfNotLogin(function() {
            $.include(['qsc-mobile-kebiao.js']);
            window.location.hash='kebiao';
        });
    });

    $('#menu .config').bind("click", function(){
        $.include(['qsc-mobile-config.js']);
        window.location.hash='config';
        return false;
    });

    $('#menu .xiaoche').bind("click", function(){
        $.include(['qsc-mobile-bus.js']);
        window.location.hash='xiaoche';
        return false;
    });

    $('#menu .about').bind("click", function() {
        window.location.hash='about';
        return false;
    });

    $('#menu .xiaoli').bind("click", function() {
        $.include(['qsc-mobile-xiaoli.js']);
        window.location.hash='xiaoli';
        return false;
    });

    $('#menu .shida').bind("click", function(){
        window.location.hash='shida';
        return false;
    });

    $('#menu .xiaohua').bind("click", function(){
        $.include(['qsc-mobile-xiaohua.js']);
        window.location.hash='xiaohua';
        return false;
    });

    $('#menu .gaikuang').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $.include(['qsc-mobile-kebiao.js']);
            window.location.hash='gaikuang';
        });
        return false;
    });

    $('#menu .kaoshi').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $.include(['qsc-mobile-kaoshi.js']);
            window.location.hash='kaoshi';
        });
        return false;
    });

    $('#menu .chengji').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $.include(['qsc-mobile-chengji.js']);
            window.location.hash='chengji';
        });
        return false;
    });

    $('#menu .update').bind("click", function(){
        myShowMsg('更新中……');
        getAllJsonp(true);
        return false;
    });

    $('#menu .zuoye').bind("click", function(){
        pleaseLoginIfNotLogin(function(){
            $.include(['qsc-mobile-zuoye.js', 'base64.js']);
            window.location.hash='zuoye';
        });
        return false;
    });


    $('.user').bind("click", function(){
        if(isLogin) {
            for (var i=0; i<localStorage.length; i++) {
                var key = localStorage.key(i);

                if(key.indexOf('Keep') != -1) continue;

                localStorage.removeItem(key);
                localStorage.setItem('stuid', false);
            }
            isLogin = false;
            window.location.reload();
        } else {
            pleaseLoginIfNotLogin(function() {
                $('#menu').show();
            });
        }

        stuid = false;
        pwd = '';
        $('#pwd').val('');

        if(isLogin) {
            $('#menu .user').attr('class', 'box user logout');
            $('#menu .user').html('注销');
        } else {
            $('#menu .user').attr('class', 'box user login');
            $('#menu .user').html('登录');
        }

        loadConfig();
    });


    $('#msg, #loading').bind("click", function(){
        $(this).hide(800);
        return false;
    });


    // delagete click event
    $('#wrap').on('click', '.slide > div > header', function(){
        if($(this).parent().hasClass('show')) {
            $(this).parent().removeClass('show');
            $(this).parent().addClass('hide');
        } else {
            $(this).parent().removeClass('hide');
            $(this).parent().addClass('show');
        }
    });

    // 自动更新数据
    if(config.update_automatically) {
        getAllJsonp();
    }

    // 强制更新数据
    var now = new Date();
    var updateDate = new Date('2012-12-19');
    var lastUpdate = localStorage.getItem('update') || 0;
    if(lastUpdate < updateDate) {
        getAllJsonp(false, function() {
            localStorage.setItem('update', now.getTime);
        });
    }


    if(isLogin) {
        $('#menu .user').attr('class', 'box user logout');
        $('#menu .user').html('注销');

        if(config['gaikuang_as_default']) {
            pleaseLoginIfNotLogin(function() {
                $.include(['qsc-mobile-kebiao.js']);
                window.history.pushState(null, document.title, '#');
                window.location.hash='gaikuang';
            });
        }
    } else {
        $('#menu .user').attr('class', 'box user login');
        $('#menu .user').html('登录');
    }
});
