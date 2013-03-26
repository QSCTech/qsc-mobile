var currentLayout = '#menu';// 存储当前处于哪个界面，方便返回时选取
window.location.hash = '';// 清除hash，进入默认界面

// 除登陆外所有跳转均需通过修改 window.location.hash 来实现
$(window).on("hashchange", function(){
    var hash = window.location.hash.toLowerCase();
    if (hash == '') {
        // 返回主界面
        $(currentLayout).hide();

        // 设置延迟，防止鼠标事件被意外传递（opera mobile）
        setTimeout(function() {
            $('#menu').show()
        }, 10);
        currentLayout = '#menu';
    } else {
        $(currentLayout).hide();
        $(hash).show();
        currentLayout = hash;
    }
});

$('.backward').bind("click", function(){
    history.back();
});

$('#menu').on('click', '#menu > div', function() {
    var id = $(this).attr('id');
    id = id.replace(/menu-/g, '');
    id = id.charAt(0).toUpperCase() + id.slice(1);
    switch(id)
    {
    case 'Login':
        isTempLogin = false;
        pleaseLoginIfNotLogin(function() {
            $('#menu').show();
        });
        break;
    case 'Logout':
        isLogin = false;
        localStorage.clear();
        $(this).html('登录');
        $(this).attr('id', 'menu-login');
        break;
    case 'Temp-login':
        isTempLogin = true;
        showLogin(function() {
            $('#menu').show();
            $('#menu-temp-login').html(stuid);
            $('#menu-temp-login').attr('id', 'menu-temp-logout');
            kebiaoInit();
        });
        break;
    case 'Temp-logout':
        isTempLogin = false;
        stuid = localStorage.getItem('stuid');
        pwd = localStorage.getItem('pwd');
        $(this).html('临时登录');
        $(this).attr('id', 'menu-temp-login');
        kebiaoInit();
        break;
    case 'Xiaoli':
    case 'Xiaoche':
    case 'Config':
        eval('load'+id+'()');
	window.location.hash = id;
        break;
    default:
        pleaseLoginIfNotLogin(function() {
            eval('load'+id+'()');
	    window.location.hash = id;
        });
        break;
    }
});

$('#msg').bind("click", function(){
    $(this).hide();
});


$('#wrap').on('click', '.slide > div > header', function(){
    if($(this).parent().hasClass('show')) {
        $(this).parent().removeClass('show');
        $(this).parent().addClass('hide');
    } else {
        $(this).parent().removeClass('hide');
        $(this).parent().addClass('show');
    }
});
