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

function pleaseLoginIfNotLogin(callback) {
    if(isLogin) {
        if(typeof(callback) == 'function') {
            callback();
        }
    } else {
        
        $('#login').show(200);
        $.include(['BigInt.js','Barrett.js','RSA.js']);
        
        $('#login_submit').click(function(){
            stuid = $("#stuid").val();
            
            var rsa_n = "AA18ABA43B50DEEF38598FAF87D2AB634E4571C130A9BCA7B878267414FAAB8B471BD8965F5C9FC3818485EAF529C26246F3055064A8DE19C8C338BE5496CBAEB059DC0B358143B44A35449EB264113121A455BD7FDE3FAC919E94B56FB9BB4F651CDB23EAD439D6CD523EB08191E75B35FD13A7419B3090F24787BD4F4E1967";
            setMaxDigits(131); //131 => n的十六进制位数/2+3  
            var key      = new RSAKeyPair("10001", '', rsa_n); //10001 => e的十六进制  
            pwd = $("#pwd").val();
            pwd = encryptedString(key, pwd); //不支持汉字
            
            myGetJsonp('validate', function(data) {
                if(stuid != '') {
                    localStorage.setItem('stuid', stuid);
                    localStorage.setItem('pwd', pwd);
                    localStorage.setItem('isLogin', true);
                    isLogin = true;
                    $('#login').slideUp(200);
                    
                    // 回调函数
                    if(typeof(callback) == 'function') {
                        callback();
                    }
                    
                } else {
                    localStorage.setItem('isLogin', false);
                    isLogin = false;
                }
            });
        });
    }
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

function myShowMsg(msg, callback) {
    $('#msg').show(200);
    $('#msg .content').html(msg);
    
    // 回调函数
    if(typeof(callback)=='function'){
        callback(msg);
    };
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
        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#kebiao').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
    });
    
    $('#menu .xiaoche').click(function(){
        $('#menu').hide(200);
        $('#xiaoche').show(200);
        $.include(['qsc-mobile-bus.js']);
    });
    
    $('#menu .gaikuang').click(function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#gaikuang').show(200);
            $.include(['qsc-mobile-kebiao.js']);
        });
    });
    
    $('#menu .kaoshi').click(function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#kaoshi').show(200);
            $.include(['qsc-mobile-kaoshi.js']);
        });
    });
    
    $('#menu .chengji').click(function(){
        pleaseLoginIfNotLogin(function() {
            $('#menu').hide(200);
            $('#chengji').show(200);
            $.include(['qsc-mobile-chengji.js']);
        });
    });
    
    $('#menu .login').click(function(){
        $('#login').show(200);
        $.include(['qsc-mobile-login.js']);
    });
    
    $('#menu .logout').click(function(){
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