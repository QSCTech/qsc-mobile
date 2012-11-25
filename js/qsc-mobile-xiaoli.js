var xiaoLiData;
var noticeData;

function loadXiaoLi() {
    var htmlImportant = '', htmlVacation = '', htmlExam = '';
    // 汇总
    for(var i=0; i<xiaoLiData.length; i++) {
        var item = xiaoLiData[i];
        var content = item['事件内容'];
        var type = item['事件类型'];
        var begin = item['起始时间'];
        var end = item['终止时间'];
        // 循环，同时对四个dom写入

        if(type == '重要事件')
            htmlImportant += '<li><div class="content">'+content+'</div><div class="begin">'+begin+'</div><div class="end">'+end+'</div></li>';
        if(type == '放假')
            htmlVacation += '<li><div class="content">'+content+'</div><div class="begin">'+begin+'</div><div class="end">'+end+'</div></li>';
        if(type == '考试')
            htmlExam += '<li><div class="content">'+content+'</div><div class="begin">'+begin+'</div><div class="end">'+end+'</div></li>';
    }


    $('#xiaoli_important ul').html(htmlImportant);
    $('#xiaoli_vacation ul').html(htmlVacation);
    $('#xiaoli_exam ul').html(htmlExam);
}

function loadNotice() {
    var htmlNotice = '';
    for(var j=0; j<noticeData.length; j++) {
        var item = noticeData[j];
        htmlNotice += '<li><div class="title">'+item.title+ '</div><div class="location">'+item.location+'</div><div class="time_start">'+item.time_start+'</div><div class="time_end">'+item.time_end+'</div></li>';
    }
    $('#xiaoli_notice ul').html(htmlNotice);

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
    loadNotice();
} else {
    myGetJsonp('notice', true, function(data) {
        if(!data) return;
        noticeData = data;
        localStorage.setItem('notice', JSON.stringify(noticeData));
        loadNotice();
    });
}