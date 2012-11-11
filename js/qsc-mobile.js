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

$.includePath = 'js/';

// 允许在file://的时候进行域外请求
$.support.cors = true;

$(document).ready(function() {
    $('.logo').click(function(){
        $(this).parent().hide(200);
        $('#menu').slideDown(200);
    });
    
    $('.backward').click(function(){
        $(this).parent().parent().hide(200);
        $('#menu').slideDown(200);
    });
    
    $('#menu .kebiao').click(function(){
        $.include(['qsc-mobile-jwb.js', 'qsc-mobile-kebiao.js']);
        $('#menu').hide(200);
        $('#kebiao').show(200);
    });
    
    $('#menu .xiaoche').click(function(){
        $('#menu').hide(200);
        $('#xiaoche').show(200);
        $.include(['qsc-mobile-bus.js']);
    });
    
    $('#menu .login').click(function(){
        $('#menu').hide(200);
        $('#login').show(200);
        $.include(['qsc-mobile-user.js']);
    });
});