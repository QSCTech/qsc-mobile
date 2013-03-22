var kebiaoData;
getData('jw/kebiao', function(data) {
    kebiaoData = data;
    displayKebiaoSummary();
    setInterval(function() {
        displayKebiaoSummary();
    }, 1000);
});
function displayKebiaoSummary() {
    if(currentLayout != '#menu') return; // no need to show it
    var now = new Date();
    var keBiao = new KeBiao(kebiaoData, now);
    var classNthNow = now.getClassNth();
    var classNthMaybe = keBiao.getClassMaybe();
    var html;

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
    html = '<div id="countdown">'+formatTimeDelta(countdown)+'</div>';
    html += '<div id="kb-sum-place">'+keBiao.getClassroom(classNthMaybe)+'</div>';
    html += '<div id="kb-sum-course">'+keBiao.getCourseName(classNthMaybe)+'</div>';

    $('#menu .kebiao').html(html);
}
