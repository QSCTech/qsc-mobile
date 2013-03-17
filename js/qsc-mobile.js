// Qsc-Mobile -- the HTML5 version
// Copyright (C) 2013 QSC Tech

// Init

var branch = "stable"; // dev or stable
var version = "The QSC Mobile HTML5 Nightly Build Version 7 / 130317";

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

// hide dev parts
if(branch != 'dev') {
    $('.dev').remove();
}

/**
 * @author Zeno Zeng
 * @desc update the Data and set it in localStroage
 * @example getData('jw/kebiao');
 */
function updateData(item, stuid, pwd, success, error) {
    if(!navigator.onLine) {
        if(typeof(error) == 'function') {
            error('好的嘛，这是已经离线的节奏……');
        }
        return;
    }
    var baseUrl = branch == "dev" ? 'http://m.myqsc.com/dev/' :'http://m.myqsc.com/stable/';
    var jsonUrl = baseUrl+item+'?stuid='+stuid+'&pwd='+pwd+'&callback=?';
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
    if(data && !localStorage.getItem('tempStuid')) {
        updateData(item, stuid, pwd);
        if(typeof(success) == 'function') {
            success(data);
        }
    } else {
        updateData(item, stuid, pwd, function(data) {
            if(typeof(success) == 'function') {
                success(data);
            }
        }, error);
    }
}

/**
 * @author Zeno Zeng
 * @returns (bool)
 */
function isLogin() {
    if(localStorage.getItem('stuid') && localStorage.getItem('stuid') != "false") {
	return true;
    } else {
	return false;
    }
}
/**
 * @author Zeno Zeng
 * @returns (bool)
 */
function isTempLogin() {
    return localStorage.getItem('tempLogin') ? true : false;
}
/**
 * @author Zeno Zeng
 */
function showMsg(msg, callback) {
    $('#msg').show();
    $('#msg').html(msg);
}
/**
 * @author Zeno Zeng
 */
function showLogin(callback) {
    $(currentLayout).hide();
    $('#login').show();

    $('#login_form').bind("submit", function() {
        var stuid = $("#stuid").val();
	var pwd = $("#pwd").val();

        if(isTempLogin()) {
            localStorage.removeItem('tempLogin');
            localStorage.setItem('tempStuid', stuid);
            localStorage.setItem('tempPwd', pwd);
        } else {
            localStorage.setItem('stuid', stuid);
            localStorage.setItem('pwd', pwd);
        }

	getData('jw/validate',
		function(data){
		    if(data['stuid'] != '') {
			$('#login').hide();

			$('#menu .user').attr('class', 'box user logout');
			$('#menu .user').html('注销');

			// 回调函数
			if(typeof(callback) == 'function') {
			    callback();
			}
		    } else {
			showMsg('登录失败');
                        if(isTempLogin()) {
                            localStorage.removeItem('tempLogin');
                            localStorage.removeItem('tempStuid');
                            localStorage.removeItem('tempPwd');
                        } else {
                            localStorage.clear();
                        }
		    }
		},
		function(data) {
		    showMsg(data);
                    if(isTempLogin()) {
                        localStorage.removeItem('tempStuid');
                        localStorage.removeItem('tempPwd');
                    } else {
                        localStorage.clear();
                    }
		});
	return false;
    });
}
/**
 * @author Zeno Zeng
 */
function pleaseLoginIfNotLogin(callback) {
    if(isLogin() || isTempLogin()) {
        if(typeof(callback) == 'function') {
            callback();
        }
    } else {
        showLogin(callback);
    }
}



var currentLayout = '#menu';// 存储当前处于哪个界面，方便返回时选取
window.location.hash = '';// 清除hash，进入默认界面

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

    $('.backward').bind("click", function(){
        history.back();
        return false;
    });

    $('#menu .kebiao').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            getData('jw/kebiao', function(data) {
                loadKebiao(data);
            });
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
        getData('share/xiaoli', function(data) {
            loadXiaoli(data);
        });
        window.location.hash='xiaoli';
        return false;
    });

    $('#menu .gaikuang').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            getData('jw/kebiao', function(data) {
                loadKebiao(data);
            });
            window.location.hash='gaikuang';
        });
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

    $('#menu .tempuser').bind("click", function() {
        localStorage.setItem('tempLogin', true);
        pleaseLoginIfNotLogin(function() {
            $('#menu').show();
        });
    });

    $('.user').bind("click", function(){
        if(isLogin()) {
            if(isTempLogin()) {
                localStorage.removeItem('tempLogin');
                localStorage.removeItem('tempStuid');
                localStorage.removeItem('tempPwd');
            } else {
                localStorage.clear();
                $('#menu .user').attr('class', 'box user login');
                $('#menu .user').html('登录');
            }
        } else {
            pleaseLoginIfNotLogin(function() {
                $('#menu').show();
            });
        }

        if(isLogin) {
            $('#menu .user').attr('class', 'box user logout');
            $('#menu .user').html('注销');
        } else {
            $('#menu .user').attr('class', 'box user login');
            $('#menu .user').html('登录');
        }
    });


    $('#msg').bind("click", function(){
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

if(isLogin()) {
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
