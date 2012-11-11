var siteUrl = 'http://m.myqsc.com/dev/index.php';
var baseUrl = 'http://zva.me/';

$(document).ready(function() {
    $('.backward').click(function(){
        $(this).parent().parent().hide(200);
        $('#menu').slideDown(200);
    });
    
    $('#menu .kebiao').click(function(){
        $('#menu').hide(200);
        $('#kebiao').show(200);
        $.getScript("js/qsc-mobile-jwb.js");
        $.getScript("js/qsc-mobile-kebiao.js");
    });
    
    $('#menu .xiaoche').click(function(){
        $('#menu').hide(200);
        $('#xiaoche').show(200);
        $.getScript("js/qsc-mobile-bus.js");
    });

    $('#menu .login').click(function(){
        $('#menu').hide(200);
        $('#login').show(200);
    });
});
