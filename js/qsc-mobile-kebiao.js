var keBiaoData;

// 设定日子
var today = new Date();
var weekArr = ['sun','mon','tue','wed','thu','fri','sat'];
var todayWeekDate = weekArr[today.getDay()];

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

function formatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function writeCountDownToDom(dom){
    var target_obj = $(dom);
    if (target_obj.length <= 0) {
        return;
    }

    var now = new Date();
    var keBiao = new KeBiao(keBiaoData, now);

    if(!keBiao.haveClass())
        return;

    var classNthNow = now.getClassNth();

    var classNthMaybe = keBiao.getClassMaybe();

    var delta;
    var msgClass;

    if(classNthNow == classNthMaybe && classNthMaybe != false) {
        // 正在上课
        msgClass = '距离下课还有：';
        var xksj = getXksj(classNthMaybe);
        delta = now.earierThan(xksj);
    } else if(classNthMaybe) {
        // 现在是下课，而且下面还有课
        msgClass = '距离上课还有：';
        var sksj = getSksj(classNthMaybe);
        delta = now.earierThan(sksj);
    } else {
        delta = 0;
    }


    if(delta) {
	var hours = formatNumberLength(Math.floor(delta/3600));
	var minutes = formatNumberLength(Math.floor((delta-hours*3600)/60), 2);
	var seconds = formatNumberLength(Math.floor(delta%60), 2);

        var msgTimer;

	if(hours > 0) {
	    msgTimer = hours+'h'+minutes+'min';
	} else {
	    msgTimer = minutes+'m'+seconds+'s';
	}

        var courseName = keBiao.getCourseName(classNthMaybe);

        var classroom = keBiao.getClassroom(classNthMaybe);

        var html = '';
        html += '<div class="msg_timer">';
        html += '<div class="msg_class">'+msgClass+'</div>';
        html += '<div class="msg_the_timer">'+msgTimer+'</div>';
        html += '</div>';
        html += '<div class="msg_course">';
        html += '<div class="msg_course_name">'+courseName+'</div>';
        html += '<div class="msg_classroom">'+classroom+'</div>';
        html += '</div>';

        $(dom).html(html);
    }
}

function writeClassToDom(dom, date){
    // 若dom不存在，直接返回。
    var target_obj = $(dom);
    if (target_obj.length <= 0) {
        return;
    }

    var htmlString = '';
    var theClass = 0;

    var keBiao = new KeBiao(keBiaoData, date);

    if(!keBiao.haveClass()) {
        $(dom).append('好的嘛，没有课了……');
        return;
    }

    while(theClass !== false) {
        theClass = keBiao.getCourseNext(theClass);

        if(keBiao.getCourseName(theClass)) {
            htmlString += '<div class="class_name">'+keBiao.getCourseName(theClass)+'</div>';
            htmlString += '<div class="class_nth_all">'+keBiao.getClassNthAll(theClass).join(',')+'</div>';
            htmlString += '<div class="class_time">'+keBiao.getCourseTime(theClass).join('-')+'</div>';
            htmlString += '<div class="class_classroom">'+keBiao.getClassroom(theClass)+'</div>';

        }
    }

    //        alert (htmlString);

    // 写入DOM
    $(dom).append(htmlString);
}

function loadKeBiao() {
    var zjuWeekInfo;
    if(today.getZjuWeek() == 'odd') {
        zjuWeekInfo = '当前周是单周。';
    } else if (today.getZjuWeek() == 'even') {
        zjuWeekInfo = '当前周是双周。';
    } else {
        zjuWeekInfo = '';
    }
    $('#zju_date_info').html(zjuWeekInfo);

    writeClassToDom('#course_today', today);
    writeClassToDom('#course_tomorrow', tomorrow);
    writeCountDownToDom('#timer');
    setInterval("writeCountDownToDom('#timer')",1000);

    var i;
    var xdate = new Date();
    var offset = today.getDay() - 1;
    var weekArr = ['mon','tue','wed','thu','fri','sat','sun'];

    for(i=0; i<7; i++) {
        xdate.setDate(today.getDate() - offset + i);
        writeClassToDom('#'+weekArr[i]+' .detail', xdate);
    }

    $('#mon .detail').show();

//    $('#kebiao #'+todayWeekDate+'')
}

if (localStorage.getItem('keBiao')) {
    keBiaoData = JSON.parse(localStorage.getItem('keBiao'));
    loadKeBiao();
} else {
    myGetJsonp('kebiao', true, function(data) {
        if(data) {
            keBiaoData = data;
            loadKeBiao();
            localStorage.setItem('keBiao', JSON.stringify(keBiaoData));
        }
    });
}