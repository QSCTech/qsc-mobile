// Copyright (C) 2012 QSC Tech. All Rights Reserved.

/**
 * @fileoverview QSC Jwb Library V1.1
 * @author zenoes@qq.com (Zeno Zeng)
 * @version 1.1
 */

// 通常, 使用 functionNamesLikeThis, variableNamesLikeThis, ClassNamesLikeThis, EnumNamesLikeThis, methodNamesLikeThis, 和 SYMBOLIC_CONSTANTS_LIKE_THIS.

/*!
 * 基础函数
 *
 */


/**
 * 返回输入日期所在周是单还是双
 * 返回odd/even
 * 有效期至2013年第27周
 * the week is the ISO 8601 week number.
 * 感谢产品的同学提供数据
 */
Date.prototype.getZjuWeek = function () {
    var oddWeekArray = [43,47,49,51,1,3,10,12,14,16,18,19,21,23,25,27]; // 单
    var evenWeekArray = [44,45,46,48,50,52,2,4,9,11,13,15,17,20,22,24,26]; // 双
    var week = this.getIsoWeek();
    
    if(oddWeekArray.indexOf(week) != -1) return 'odd';
    if(evenWeekArray.indexOf(week) != -1) return 'even';
    
    return false;
};

/**
 * 返回输入日期所在学期或者假期
 * 有效期至2013年第33周
 * the week is the ISO 8601 week number.
 * 感谢产品的同学提供数据
 */
Date.prototype.getZjuSemester = function () {
    var week = this.getIsoWeek();
    
    switch (true) {
      case week >= 43 && week <= 46:
	return '秋';
      case week >= 47 && week <= 52:
	return '冬';
      case week >= 5 && week <= 8:
	return '寒假';
      case week >= 9 && week <= 18:
	return '春';
      case week >= 19 && week <= 27:
	return '夏';
      case week >= 28 && week <= 33:
	return '暑假';
      case week >= 1 && week <= 4:
	return '冬';
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
    var i, max;
    
    for(i = 1; i < 14; i++){
	if(this.laterThan(getSksj(i))) {
	    max = i;
	}
    }
    
    max++;
    return max > 13 ? max : false;
};


/**
 * 课表类封装：读取指定日期的课表
 */

function KeBiao(data, date){
    var week = date.getZjuWeek();
    var semester = date.getZjuSemester();    
    var weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    var weekdate = weekday[date.getDay()];
//    alert(weekdate);
    var i, j, classes, n;
    var keBiao = [];
    
    for (i=0; i<data.length; i++)
    { 
	if(typeof(data[i]['time'][week]) == "undefined") 
	{
	    continue;
	}
	if(typeof(data[i]['time'][week][weekdate]) == "undefined") 
	{
	    continue;
	}
	if(data[i]['semester'].indexOf(semester, 0) === -1)
	{
	    continue;
	}
        
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
Date.prototype.getIsoWeek = function (dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */
    // You may copy and paste this code without charge. All we ask is you leave the credit line in the function body intact.
    
    var nYear, nday;
    
    dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() -
			     (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
	weeknum = Math.floor((daynum+day-1)/7) + 1;
	if(weeknum > 52) {
	    nYear = new Date(this.getFullYear() + 1,0,1);
	    nday = nYear.getDay() - dowOffset;
	    nday = nday >= 0 ? nday : nday + 7;
	    /*if the next year starts before the middle of
	     the week, it is week #1 of that year*/
	    weeknum = nday < 4 ? 1 : 53;
	}
    }
    else {
	weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
};
