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


(function ($) {
    $.fn["myhide"] = function () {
        this.addClass('hide');
    };
})(jq);

var siteUrl = 'http://localhost/qsc-mobile-back/index.php';
//var siteUrl = 'http://m.myqsc.com/dev3/mobile2/index.php';

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

    if(isLogin) {
        $('#menu .user').attr('class', 'box user logout');
        $('#menu .user').html('注销');

        if(config['gaikuang_as_default']) {
            $('#menu').myhide();
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
        $(this).parent().myhide();
        $('#menu').myshow();
        return false;
    });

    $('.backward').bind("mousedown", function(){
        $(this).parent().parent().myhide();

        // 设置延迟，防止鼠标事件被意外传递（opera mobile）
        setTimeout(function() {
            $('#menu').myshow()
        }, 10);
        return false;
    });

    $('#menu .kebiao').bind("mousedown", function(){

        pleaseLoginIfNotLogin(function() {
            $('#menu').myhide();
            $('#kebiao').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
    });

    $('#menu .config').bind("mousedown", function(){
        $('#menu').myhide();
        $('#config').show(200);
        $.include(['qsc-mobile-config.js']);
        return false;
    });

    $('#menu .xiaoche').bind("click", function(){
        $('#menu').myhide();
        $('#xiaoche').show(200);
        $.include(['qsc-mobile-bus.js']);
        return false;
    });

    $('#menu .about').bind("click", function() {
        $('#menu').myhide();
        $('#about').myshow();
    });

    $('#menu .xiaoli').bind("click", function() {
        $('#menu').myhide();
        $('#xiaoli').myshow();
        $.include(['qsc-mobile-xiaoli.js']);
    });

    $('#menu .shida').bind("click", function(){
        $('#menu').myhide();
        $('#shida').myshow();
    });

    $('#menu .xiaohua').bind("click", function(){
        $('#menu').myhide();
        $('#xiaohua').show(200);
        $.include(['qsc-mobile-xiaohua.js']);
    });

    $('#menu .gaikuang').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').myhide();
            $('#gaikuang').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
        return false;
    });

    $('#menu .kaoshi').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').myhide();
            $('#kaoshi').show(200);
            $.include(['qsc-mobile-kaoshi.js']);
        });
        return false;
    });

    $('#menu .chengji').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').myhide();
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
            $('#menu').myhide();
            $('#zuoye').myshow();
            $.include(['qsc-mobile-zuoye.js']);
        });
    });


    $('#menu .login').bind("click", function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').myshow();
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

    slideBind();
});
