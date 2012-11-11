var busData = false;

function loadBusInfo(){
    if(!busData)
        return;
    
    var from = $('select#from').val();
    var to = $('select#to').val();
    
    var i;
    var theBus = [];
    for(i=0; i < busData.length; i++) {
        if(busData[i]['起点'] != from)
            continue;
        if(busData[i]['终点'] != to)
            continue;
        theBus.push(busData[i]);
    }
    $('#bus_info').html('');// 清空旧数据
    if(theBus.length == 0) {
        $('#bus_info').html('<br>好像木有车的样子。');// 清空旧数据
    } else {
        for(i=0; i<theBus.length; i++) {
            $('#bus_info').append('<ul>');
            $('#bus_info').append('<li><strong>车号：</strong><span>'+theBus[i]['车号']+'</span></li>');
            $('#bus_info').append('<li><strong>发车：</strong><span>'+theBus[i]['发车时间']+'</span></li>');
            $('#bus_info').append('<li><strong>到站：</strong><span>'+theBus[i]['到站时间']+'</span></li>');
            $('#bus_info').append('<li><strong>运行：</strong><span>'+theBus[i]['运行时间']+'</span></li>');
            $('#bus_info').append('<li><strong>停靠：</strong><span>'+theBus[i]['停靠地点']+'</span></li>');
            $('#bus_info').append('</ul>');
        }
    }
}

$(document).ready(function() {
    // &callback?是为了使用跨域JSONP调用
    $.getJSON(baseUrl+'jsonp.php?data=bus&callback=?', function(data) {
        busData = data;
        setInterval("loadBusInfo()",10);
    });
});