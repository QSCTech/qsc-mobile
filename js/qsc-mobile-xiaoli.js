var noticeApi = 'http://www.qsc.zju.edu.cn/apps/notice/index.php/api/event_list';
var xiaoLiData;

function loadXiaoLi() {
    var html;
    // 汇总
    for(var i=0; i<xiaoLiData.length; i++) {
        var item = xiaoLiData[i];
        var content = item['事件内容'];
        var type = item['事件类型'];
        var begin = item['起始时间'];
        var end = item['终止时间'];
        // 循环，同时对四个dom写入
    }

}

if (localStorage.getItem('xiaoLi')) {
    xiaoLiData = JSON.parse(localStorage.getItem('xiaoLi'));
    loadXiaoLi();
} else {
    myGetJsonp('calendar', true, function(data) {
        if(!data) return;
        xiaoLiData = data;
        localStorage.setItem('xiaoLi', JSON.stringify(xiaoLiData));
        loadXiaoLi();
    });
}

if (localStorage.getItem('notice')) {
    noticeData = JSON.parse(localStorage.getItem('notice'));
    loadXiaoLi();
} else {
    myGetJsonp('notice', true, function(data) {
        if(!data) return;
        noticeData = data;
        localStorage.setItem('notice', JSON.stringify(noticeData));
        loadXiaoLi();
    });
}