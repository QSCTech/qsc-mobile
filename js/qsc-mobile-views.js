var kebiaoData;
function writeCountDownToDom(dom){
    var target_obj = $(dom);
    if (target_obj.length <= 0) {
        return;
    }

    var now = new Date();
    var keBiao = new KeBiao(kebiaoData, now);

    if(!keBiao.haveClass()) {
        return;
    }

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


    if(delta > 0) {
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
    } else {
        $(dom).html('');
    }
}

function loadKebiao(data) {
    kebiaoData = data;
    function writeClassToDom(dom, data, date){
        // 若dom不存在，直接返回。
        var target_obj = $(dom);
        if (target_obj.length <= 0) {
            return;
        }

        var htmlString = '';
        var theClass = 0;

        var keBiao = new KeBiao(data, date);

        if(!keBiao.haveClass()) {
            $(dom).html('<div class="no_class">好的嘛，没有课了……</div>');
            return;
        }

        while(theClass !== false) {
            theClass = keBiao.getCourseNext(theClass);

            if(keBiao.getCourseName(theClass)) {
                htmlString += '<div class="class_name">'+keBiao.getCourseName(theClass)+'</div>';
                htmlString += '<div class="class_nth_all">'+keBiao.getClassNthAll(theClass).join(',')+'</div>';
                htmlString += '<div class="class_teacher_name">'+keBiao.getTeacherName(theClass)+'</div>';
                htmlString += '<div class="class_time">'+keBiao.getCourseTime(theClass).join('-')+'</div>';
                htmlString += '<div class="class_classroom">'+keBiao.getClassroom(theClass)+'</div>';
            }
        }

        //        alert (htmlString);

        // 写入DOM
        $(dom).html(htmlString);
    }


    var today = new Date();
    var weekArr = ['sun','mon','tue','wed','thu','fri','sat'];
    var todayWeekDate = weekArr[today.getDay()];

    var tomorrow = new Date();
    tomorrow.setTime(tomorrow.getTime() + 1000*3600*24);

    var zjuWeekInfo;
    tomorrow.setTime(tomorrow.getTime() + 1000*3600*24);

    if(today.getZjuWeek() == 'odd') {
        zjuWeekInfo = '当前周是单周。';
    } else if (today.getZjuWeek() == 'even') {
        zjuWeekInfo = '当前周是双周。';
    } else {
        zjuWeekInfo = '';
    }
    $('#zju_date_info').html(zjuWeekInfo);

    writeClassToDom('#course_today', data, today);
    writeClassToDom('#course_tomorrow', data, tomorrow);
    writeCountDownToDom('#timer');
    setInterval("writeCountDownToDom('#timer')",1000);

    var i;
    var offset = today.getDay() == 0 ? today.getDay() + 6 : today.getDay() - 1;

    for(i=0; i<7; i++) {
        var xdate = new Date(today.getTime() + (i - offset) * 24 * 3600 * 1000);
        writeClassToDom('#'+weekArr[i]+' .detail', data, xdate);
    }

    $('#mon .detail').show();
}
