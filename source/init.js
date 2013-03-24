// Qsc-Mobile -- the HTML5 version
// Copyright (C) 2013 QSC Tech.

var branch = "stable"; // dev or stable
var version = "QSC Mobile HTML5 Nightly Build Version 9 / 130323";
var stuid, pwd, isLogin = false, isTempLogin = false;

var config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {};
var config_list = ['switch_to_dev_branch'];
for(var i = 0; i < 1; i++) {
    var item = config_list[i];
    if(typeof(config[item]) == "undefined")
      config[item] = false; // 默认关闭特性
}
if(config['switch_to_dev_branch']) {
    branch = "dev";
}
if(branch != 'dev') {
    $('.dev').remove();
}

stuid = localStorage.getItem('stuid');
pwd = localStorage.getItem('pwd');
if(stuid && pwd) {
    isLogin = true;
}

if(isLogin) {
    $('#menu-user').html('注销');
    $('#menu-user').attr('id', 'menu-logout');
} else {
    $('#menu-user').html('登录');
    $('#menu-user').attr('id', 'menu-login');
}