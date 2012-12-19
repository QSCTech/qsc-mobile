// Copyright (C) 2012 QSC Tech. All Rights Reserved.


var jwbData = {"oddWeekArray":[43,47,49,51,1,3,10,12,14,16,18,19,21,23,25,27],"evenWeekArray":[44,45,46,48,50,52,2,4,9,11,13,15,17,20,22,24,26],"chun":[9,10,11,12,13,14,15,16,17,18],"xia":[19,20,21,22,23,24,25,26,27],"qiu":[43,44,45,46],"dong":[1,2,3,4,47,48,49,50,51,52],"hanjia":[5,6,7,8],"shujia":[28,29,30,31,32,33]};


/**
 * 返回输入日期所在周是单还是双
 * 返回odd/even
 * the week is the ISO 8601 week number.
 * 感谢产品的同学提供数据
 */
Date.prototype.getZjuWeek = function () {
    var oddWeekArray, evenWeekArray, week;

    oddWeekArray = jwbData.oddWeekArray;
    evenWeekArray = jwbData.evenWeekArray;
    week = this.getIsoWeek();

    if(oddWeekArray.indexOf(week) != -1) return 'odd';
    if(evenWeekArray.indexOf(week) != -1) return 'even';

    return false;
};

/**
 * 返回输入日期所在学期或者假期
 * the week is the ISO 8601 week number.
 * 感谢产品的同学提供数据
 */
Date.prototype.getZjuSemester = function () {
    var week = this.getIsoWeek();

    switch (true) {
        case jwbData.chun.indexOf(week) != -1:
	return '春';
        case jwbData.xia.indexOf(week) != -1:
	return '夏';
        case jwbData.qiu.indexOf(week) != -1:
	return '秋';
        case jwbData.dong.indexOf(week) != -1:
	return '冬';
        case jwbData.shujia.indexOf(week) != -1:
	return '暑假';
        case jwbData.hanjia.indexOf(week) != -1:
	return '寒假';
        default:
	return false;
    }
};

// 获取第n节课的上课时间
function getSksj(nth) {
    //首项为空来取代[0]
    var sksj = ["","08:00","08:50","09:50","10:40","11:30","13:15","14:05","14:55","15:55","16:45","18:30","19:20","20:10"];
    return sksj[nth];
}

// 获取第n节课的下课时间
function getXksj(nth){
    //首项为空来取代[0]
    var xksj = ["","08:45","09:35","10:35","11:25","12:15","14:00","14:50","15:40","16:40","17:30","19:15","20:05","20:55"];
    return xksj[nth];
}

// 返回是第几节
// 若这时候本来就没课，返回false
Date.prototype.getClassNth = function () {
    var i;

    for(i = 1; i < 14; i++){
	if(this.laterThan(getSksj(i)) && !this.laterThan(getXksj(i)))
	{
	    return i;
	}
    }

    return false;
};

// 返回下节课是第几节
// 若没有下节课了就返回false
Date.prototype.getClassNthNext = function () {
    var i, max = 0;

    for(i = 1; i < 14; i++){
	if(this.laterThan(getSksj(i))) {
	    max = i;
	}
    }

    max++;
    return max > 13 ? false : max;
};


/**
 * 课表类封装：读取指定日期的课表
 */

function KeBiao(data, date){
    var week = date.getZjuWeek();
    var semester = date.getZjuSemester();
    var weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var weekdate = weekday[date.getDay()];
    var i, j, classes, n;
    var keBiao = [];

    for (i=0; i<data.length; i++)
    {
        if(typeof(data[i].time) == "undefined")
          continue;
	if(typeof(data[i]['time'][week]) == "undefined")
	  continue;
	if(typeof(data[i]['time'][week][weekdate]) == "undefined")
	  continue;
	if(data[i]['semester'].indexOf(semester, 0) === -1)
	  continue;

	classes = data[i]['time'][week][weekdate];
	for(j=0; j<classes.length; j++) {
	    n = {
		'id':data[i]['id'],
		'name':data[i]['name'],
		'teacher':data[i]['teacher'],
		'classroom':data[i]['place'][week][weekdate]
	    };
	    keBiao[classes[j]] = n;
        }
    }

    // 返回第n节课的课程代号
    this.getCourseId = function(nth) {
	return typeof(keBiao[nth]) != "undefined" ? keBiao[nth]['id'] : false;
    };

    // 返回第n节课的课程名
    this.getCourseName = function(nth) {
	return typeof(keBiao[nth]) != "undefined" ? keBiao[nth]['name'] : false;
    };

    // 返回第n节课的上课地点
    this.getClassroom = function(nth) {
	return typeof(keBiao[nth]) != "undefined" ? keBiao[nth]['classroom'] : false;
    };

    // 返回第n节课的任课老师
    this.getTeacherName = function(nth) {
	return typeof(keBiao[nth]) != "undefined" ? keBiao[nth]['teacher'] : false;
    };

    // 返回课程唯一码
    this.getCourseHash = function(nth) {
        var hash = this.getCourseId(nth)+this.getClassroom(nth)+this.getTeacherName(nth);
        return hash;
    };


    this.getCourseTime = function(nth) {
        var nthArr = this.getClassNthAll(nth);
        var sksj = getSksj(nthArr[0]);
        var xksj = getXksj(nthArr[nthArr.length -1]);
        return [sksj, xksj];
    };

    // 判断该天是否有课
    this.haveClass = function() {
	return keBiao.length > 0 ? true : false;
    };

    this.getClassNthAll = function(nth) {
        var hash = this.getCourseHash(nth);
        var arr = [];

        for(i=1; i <= 13; i++) {
            if(this.getCourseHash(i) == hash){
                arr.push(i);
            }
        }

        return arr;
    };

    // 返回下一节有效的nth
    this.getClassNext = function(nth) {
        nth = nth > 0 ? nth : 0;
        for(i = nth + 1; i <= 13; i++) {
            if(this.getCourseName(i))
              return i;
        }
        return false;
    };

    // 若正在上课，返回当前nth，否则返回下节课nth，若下面没课，返回false
    this.getClassMaybe = function() {
        var now = new Date();
        var i;

        // 现在有课
        var nth_now = now.getClassNth();

        if(this.getCourseName(nth_now) && nth_now != false)
          return nth_now;

        var nth_next = now.getClassNthNext();

        // 现在已经是第十三节
        if(!nth_next)
          return false;

        // 下面还有课
        for(i=nth_next; i <14; i++) {
            if(this.getCourseName(i) != false) {
                return i;
            }
        }

        // 真没课了
        return false;
    };


    // 返回下一门有效的nth
    this.getCourseNext = function(theClass) {
        theClass = theClass > 0 ? theClass : 0;
        for(i = theClass; i <= 13; i++) {
            i++;
            if(this.getCourseName(i)) {
                while(this.getCourseHash(i+1) == this.getCourseHash(i)) {
                    i++;
                }
                return i;
            }
        };
        return false;
    };

}



/*!
 * 依赖的函式库
 *
 */


// 为了处理课表封装的……
// 假设现在是08:00，date = new Date()
// date.laterThan('07:00') => 3600，返回差距秒数
// date.laterThan('08:00') => false

Date.prototype.laterThan = function (timeString) {
    var n = timeString.split(':');
    var newDate = new Date(this);
    newDate.setHours(n[0], n[1], 0);
    var delta = this.getTime() - newDate.getTime();
    return delta > 0 ? Math.floor(delta/1000) : false;
};
Date.prototype.earierThan = function (timeString) {
    var n = timeString.split(':');
    var newDate = new Date(this);
    newDate.setHours(n[0], n[1], 0);
    var delta = newDate.getTime() - this.getTime();
    return delta > 0 ? Math.floor(delta/1000) : false;
};


/**
 * Returns the week number for this date. dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
Date.prototype.getIsoWeek = function () {
    // todo : fix get IsoWeek

    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */
    // You may copy and paste this code without charge. All we ask is you leave the credit line in the function body intact.


    var nYear, nday;

    var dowOffset = 0;
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() -
			     (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;

    // 若是周日，返回昨天的weeknum
    if(this.getDay() == 0)
      daynum--;

    //if the year starts before the middle of a week
    if(day < 4) {
	weeknum = Math.floor((daynum+day-1)/7) + 1;
	if(weeknum > 52) {
	    nYear = new Date(this.getFullYear() + 1,0,1);
	    nday = nYear.getDay() - dowOffset;
	    nday = nday >= 0 ? nday : nday + 7;
	    /*if the next year starts before the middle of the week, it is week #1 of that year*/
	    weeknum = nday < 4 ? 1 : 53;
	}
    } else {
	weeknum = Math.floor((daynum+day-1)/7);
    }


    return weeknum;
};



var keBiaoData;

function getAndLoadKebiao() {
    myGetJsonp('kebiao', true, function(data) {
        if(data) {
            keBiaoData = data;
            localStorage.setItem('keBiao', JSON.stringify(keBiaoData));
            loadKeBiao();
        }
    });
}

if (localStorage.getItem('keBiao')) {
    keBiaoData = JSON.parse(localStorage.getItem('keBiao'));
    if(keBiaoData.length > 0)
      loadKeBiao();
    else
      getAndLoadKebiao();
} else {
    getAndLoadKebiao();
}

// 设定日子
var today = new Date();
var weekArr = ['sun','mon','tue','wed','thu','fri','sat'];
var todayWeekDate = weekArr[today.getDay()];

var tomorrow = new Date();
tomorrow.setTime(tomorrow.getTime() + 1000*3600*24);

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

    var keBiao;
    keBiao = new KeBiao(keBiaoData, date);

    if(!keBiao.haveClass()) {
        $(dom).html('<div class="no_class">好的嘛，没有课了……</div>');
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
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setTime(tomorrow.getTime() + 1000*3600*24);

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
    var offset = today.getDay() == 0 ? today.getDay() + 6 : today.getDay() - 1;
    var weekArr = ['mon','tue','wed','thu','fri','sat','sun'];

    for(i=0; i<7; i++) {
        var xdate = new Date(today.getTime() + (i - offset) * 24 * 3600 * 1000);
        writeClassToDom('#'+weekArr[i]+' .detail', xdate);
    }

    $('#mon .detail').show();
}
