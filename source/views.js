var currentLayout = '#menu';// 存储当前处于哪个界面，方便返回时选取
window.location.hash = '';// 清除hash，进入默认界面

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
