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
var config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {};
var config_list = ['update_automatically', 'evaluate_teacher_automatically', 'gaikuang_as_default'];
for(var i = 0; i < config_list.length; i++) {
    var item = config_list[i];
    if(typeof(config[item]) == "undefined")
      config[item] = false; // 默认关闭特性
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

    if(localStorage.getItem('callback')) {
        var theCallback = '('+localStorage.getItem('callback')+'())';
        eval(theCallback);
        localStorage.removeItem('callback');
    }

    // var width = screen.width;
    // var devicePixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    // var vpScale = width/640/devicePixelRatio;

    var metas = document.getElementsByTagName('meta');
    var i;
    for (i=0; i< metas.length; i++) {
        if (metas[i].name == "viewport") {
            metas[i].content = "width=640";
        }
    }


    if(isLogin) {
        $('#menu .user').attr('class', 'box user logout');
        $('#menu .user').html('注销');

        if(config['gaikuang_as_default']) {
            $('#menu').hide(200);
            pleaseLoginIfNotLogin(function() {
                $('#gaikuang').show(200);
                $.include(['qsc-mobile-kebiao.js']);
            });
        }
    } else {
        $('#menu .user').attr('class', 'box user login');
        $('#menu .user').html('登录');
    }


    $('.logo').bind("mousedown", function(){
        $(this).parent().hide();
        $('#menu').show();
        return false;
    });

    $('.backward').bind("mousedown", function(){
        $(this).parent().parent().hide(200);

        // 设置延迟，防止鼠标事件被意外传递（opera mobile）
        setTimeout(function() {
            $('#menu').show()
        }, 10);
        return false;
    });

    $('#menu .kebiao').bind("mousedown", function(){

        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#kebiao').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
    });

    $('#menu .config').bind("mousedown", function(){
        $('#menu').hide(200);
        $('#config').show(200);
        $.include(['qsc-mobile-config.js']);
        return false;
    });

    $('#menu .xiaoche').bind("click", function(){
        $('#menu').hide(200);
        $('#xiaoche').show(200);
        $.include(['qsc-mobile-bus.js']);
        return false;
    });

    $('#menu .shida').bind("click", function(){
        $('#menu').hide();
        $('#shida').show();
    });

    $('#menu .xiaohua').bind("click", function(){
        $('#menu').hide(200);
        $('#xiaohua').show(200);
        $.include(['qsc-mobile-xiaohua.js']);
    });

    $('#menu .gaikuang').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#gaikuang').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
        return false;
    });

    $('#menu .kaoshi').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#kaoshi').show(200);
            $.include(['qsc-mobile-kaoshi.js']);
        });
        return false;
    });

    $('#menu .chengji').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#chengji').show(200);
            $.include(['qsc-mobile-chengji.js']);
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
            $('#menu').hide(200);
            window.location.href="homework.html";
        });
    });


    $('#menu .login').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
        });
    });

    $('#menu .logout').bind("click", function(){
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


    // 自动更新数据
    if(config.update_automatically) {
        getAllJsonp();
    }


    $('.slide > div').bind("click", function(){
        $(this).parent().children('div').attr('class', 'detail');
        $(this).attr('class', 'current detail');
    });
});
