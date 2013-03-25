var kebiaoData;
function kebiaoInit() {
    (function() {
        getData('jw/kebiao', function(data) {
            kebiaoData = data;
            displayKebiaoSummary();
            var kbSummaryInt = setInterval(function() {
                displayKebiaoSummary();
            }, 1000);
        });
    })();
}
kebiaoInit();
function displayKebiaoSummary() {
    if(currentLayout != '#menu'&& currentLayout != '') return; // no need to show it
    if(!isLogin && !isTempLogin) {
        $('#menu-kebiao').html('课表');
        return;
    }
    var now = new Date();
    var keBiao = new KeBiao(kebiaoData, now);
    var classNthNow = now.getClassNth();
    var classNthMaybe = keBiao.getClassMaybe();
    var html = '';

    // get count down
    var countdown;
    if(classNthMaybe && classNthNow == classNthMaybe) {
        // 正在上课
        countdown = now.earierThan(getXksj(classNthMaybe));
    } else if (classNthMaybe) {
        // 现在没课，待会有课
        countdown = now.earierThan(getSksj(classNthMaybe));
    } else {
        countdown = 0;
    }
    if(classNthMaybe) {
        html += '<div id="countdown">'+formatTimeDelta(countdown)+'</div>';
        html += '<div id="kb-sum-place">'+keBiao.getClassroom(classNthMaybe)+'</div>';
        html += '<div id="kb-sum-course">'+keBiao.getCourseName(classNthMaybe)+'</div>';
    } else {
        html += displayTomorrowSummary();
    }
    $('#menu-kebiao').html(html);
}
function displayTomorrowSummary() {
    var html = '';
    html += '明天的课:<div id="tomorrow-summary">';
    var tomorrow = new Date();
    tomorrow.setTime(tomorrow.getTime() + 1000*3600*24);
    var keBiao = new KeBiao(kebiaoData, tomorrow);
    html += keBiao.getCourseNameList().join(',<br>');
    html += '</div>';
    return html;
}
function writeClassToDom(dom, date){
    var htmlString = '';
    var theClass = 0;

    var keBiao;
    keBiao = new KeBiao(kebiaoData, date);

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

    $(dom).append(htmlString);
}
function loadKebiao() {
    var zjuWeekInfo;
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setTime(tomorrow.getTime() + 1000*3600*24);

    writeClassToDom('#today .detail', today);
    writeClassToDom('#tomorrow .detail', tomorrow);

    var i;
    var offset = today.getDay() == 0 ? today.getDay() + 6 : today.getDay() - 1;
    var weekArr = ['mon','tue','wed','thu','fri','sat','sun'];

    for(i=0; i<7; i++) {
        var xdate = new Date(today.getTime() + (i - offset) * 24 * 3600 * 1000);
        writeClassToDom('#'+weekArr[i]+' .detail', xdate);
    }
}
