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

var siteUrl = 'http://localhost/qsc-mobile-back/index.php';
var baseUrl = 'http://zva.me/';

var stuid = localStorage.getItem('stuid') ? localStorage.getItem('stuid') : false;
var pwd = localStorage.getItem('pwd') ? localStorage.getItem('pwd') : false;
var isLogin = localStorage.getItem('isLogin') ? localStorage.getItem('isLogin') : false;

function pleaseLoginIfNotLogin() {
    if(isLogin) return;
    
    $('.mask').hide(200);
    $('#login').show(200);
    $.include(['qsc-mobile-login.js']);
}


function myGetJsonp(name, callback) {
    $.getJSON(siteUrl+'/jsonp/'+name+'?stuid='+stuid+'&pwd='+pwd+'&callback=?', function (data) {
        
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
        
        // 回调函数
        if(typeof(callback)=='function'){   
            callback(data);
        };
    });
}

function myShowMsg(msg) {
    $('#msg').show(200);
    $('#msg .content').html(msg);
}

$.includePath = 'js/';

// 允许在file://的时候进行跨域请求
$.support.cors = true;

$(document).ready(function() {
    $('#msg .close').click(function(){
        $('#msg').slideUp(800);
    });
    
    $('.logo').click(function(){
        $(this).parent().hide(200);
        $('#menu').slideDown(200);
    });
    
    $('.backward').click(function(){
        $(this).parent().parent().hide(200);
        $('#menu').slideDown(200);
    });
    
    $('#menu .kebiao').click(function(){
        $.include(['qsc-mobile-kebiao.js']);
        $('#menu').hide(200);
        $('#kebiao').show(200);
    });
    
    $('#menu .xiaoche').click(function(){
        $('#menu').hide(200);
        $('#xiaoche').show(200);
        $.include(['qsc-mobile-bus.js']);
    });
    
    $('#menu .gaikuang').click(function(){
        $('#menu').hide(200);
        $('#gaikuang').show(200);
        $.include(['qsc-mobile-kebiao.js']);
    });
    
    $('#menu .kaoshi').click(function(){
        $('#menu').hide(200);
        $('#kaoshi').show(200);
        $.include(['qsc-mobile-kaoshi.js']);
    });
    
    $('#menu .chengji').click(function(){
        $('#menu').hide(200);
        $('#chengji').show(200);
        $.include(['qsc-mobile-chengji.js']);
    });
    
    $('#menu .login').click(function(){
        $('#menu').hide(200);
        $('#login').show(200);
        $.include(['qsc-mobile-login.js']);
    });
});

$(document).ready(function() {
    $('.slide header').click(function(){
	$('header').removeClass('current');
	$('.detail').slideUp(100);
	$(this).next().slideDown(100);
	$(this).addClass('current');
    });
    $('.slide header:first').click();
});