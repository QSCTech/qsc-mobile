// Qsc-Mobile -- the HTML5 version
// Copyright (C) 2013 QSC Tech
// todo: use js-doc

// Init

var debugOn = false;
var branch = "stable"; // dev or stable
var version = "The QSC Mobile HTML5 Nightly Build Version 6 / 130317";

// load config

var config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {};
var config_list = ['gaikuang_as_default',
                   'switch_to_dev_branch'];
for(var i = 0; i < config_list.length; i++) {
    var item = config_list[i];
    if(typeof(config[item]) == "undefined")
      config[item] = false; // 默认关闭特性
}

if(config['switch_to_dev_branch']) {
    branch = "dev";
}

// get user data

var stuid = localStorage.getItem('stuid',false) ? localStorage.getItem('stuid') : false;
var pwd = localStorage.getItem('pwd',false) ? localStorage.getItem('pwd') : false;
var isLogin = localStorage.getItem('isLogin',false) ? localStorage.getItem('isLogin') : false;

// hide dev parts
if(branch != 'dev') {
    $('.dev').remove();
}

// Common Functions
/**
 * @author Zeno Zeng
 * @desc update the Data and set it in localStroage
 * @example getData('jw/kebiao');
 */
function updateData(item, success, error) {
    if(!navigator.onLine) {
        if(typeof(error) == 'function') {
            error('好的嘛，这是已经离线的节奏……');
        }
        return;
    }
    var baseUrl = branch == "dev" ? 'http://m.myqsc.com/dev/' :'http://m.myqsc.com/stable/';
    var jsonUrl = baseUrl+item;
    error = typeof(error) == 'function' ? error : function(msg) {return;};
    success = typeof(success) == 'function' ? success : function(msg) {return;};
    $.jsonP({url:jsonUrl,
             success:function(data){
                 if(typeof(data['code']) != "undefined") {
                     if(data['code'] == 0) {
                         // 远端返回错误
                         error(data['msg']);
                         return;
                     }
                     if(data['code'] == 1) {
                         console.log('getJson: code = 1');
                         // 远端返回消息
                         error(data['msg']);
                         // 再次访问远端来获取内容（递归）
                         updateData(item, success, error);
                     } else {
                         // 未知情况
                         console.log('getJson:未知情况');
                         return;
                     }
                 } else {
                     localStorage.setItem(item, JSON.stringify(data));
                     success(data);
                 }
             },
             error:function() {
                 error('好的嘛，好像有什么错误？');
             }
            });

}
/**
 * @author Zeno Zeng
 * @example getData('jw/kebiao');
 */
function getData(item, success, error) {
    var stuid, pwd, data;

    if(localStorage.getItem('tempStuid')) {
        stuid = localStorage.getItem('tempStuid');
        pwd = localStorage.getItem('tempPwd');
    } else {
        stuid = localStorage.getItem('stuid');
        pwd = localStorage.getItem('pwd');
    }
    // try get from localStorage and update it, if not exists, wait for downloading complete
    data = localStorage.getItem('item');
    if(data) {
        updateData(item);
        if(typeof(success) == 'function') {
            success(data);
        }
    } else {
        updateData(item, function(data) {

            if(typeof(success) == 'function') {
                success(data);
            }
        }, error);
    }
}

function showMsg(msg, callback) {}

function myGetJsonp(name, showMsg, callback, getArray) {
    try {
        if(!navigator.onLine) {
            myShowMsg('好的嘛，这是已经离线的节奏……');
            return;
        }

        if(showMsg)
          $('#loading').show();

        if(!pwd)
          pwd = '';

        var myJsonpUrl = siteUrl+'/jsonp/'+name+'?stuid='+stuid+'&pwd='+pwd+'&callback=?';

        if(name == 'kebiao') {
            myJsonpUrl = 'http://m.myqsc.com/stable/jw/kebiao?stuid='+stuid+'&pwd='+pwd+'&callback=?';
        }

        $.jsonP({url:myJsonpUrl,
                 success:function(data){

                     console.log('getJson:'+JSON.stringify(data));

                     if(typeof(data['code']) != "undefined") {
                         if(data['code'] == 0) {
                             // 远端返回错误
                             myShowMsg(data['msg']);
                             return;
                         }
                         if(data['code'] == 1) {
                             console.log('getJson: code = 1');

                             // 远端返回消息
                             myShowMsg(data['msg']);

                             // 再次访问远端来获取内容（递归）
                             myGetJsonp(name, callback);
                         } else {
                             // 未知情况
                             console.log('getJson:未知情况');
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

    } catch(e) {
        console.log("getJson:"+e);
    }
}
function getAllJsonp(showDone, callback) {
    var request_count = 2;

    var request_done_check = setInterval(function(){
        if(request_count !== 0)
	  return;

        if(showDone)
          myShowMsg('好的嘛，请求完毕');
        clearInterval(request_done_check);

        if(typeof(callback)=='function'){
            callback();
        };
    }, 10);

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



// 存储当前处于哪个界面，方便返回时选取
var currentLayout = '#menu';
// 清除hash，进入默认界面
window.location.hash = '';

$(document).ready(function() {

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

    $('.backward').bind("click", function(){
        history.back();
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

    $('#menu .xiaoli').bind("click", function() {
        $.include(['qsc-mobile-xiaoli.js']);
        window.location.hash='xiaoli';
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
    });


    $('#msg, #loading').bind("click", function(){
        $(this).hide();
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

    if(isLogin) {
        $('#menu .user').attr('class', 'box user logout');
        $('#menu .user').html('注销');

        if(config['gaikuang_as_default']) {
            pleaseLoginIfNotLogin(function() {
                $.include(['qsc-mobile-kebiao.js']);
                if(window.history.pushState) {
                    window.history.pushState(null, document.title, '#');
                }
                window.location.hash='gaikuang';
            });
        }
    } else {
        $('#menu .user').attr('class', 'box user login');
        $('#menu .user').html('登录');
    }
});
