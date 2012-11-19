function loadBusInfo(){
    if(!xiaoCheData)
        return;

    var from = $('select#from').val();
    var to = $('select#to').val();

    var i;
    var theBus = [];
    for(i=0; i < xiaoCheData.length; i++) {
        if(xiaoCheData[i]['起点'] != from)
            continue;
        if(xiaoCheData[i]['终点'] != to)
            continue;
        theBus.push(xiaoCheData[i]);
    }
    $('#bus_info').html('');// 清空旧数据
    if(theBus.length == 0) {
        $('#bus_info').html('<br>好像木有车的样子。');// 清空旧数据
    } else {
        var s = "";
        for(i=0; i<theBus.length; i++) {
            s += '<div class="bus_info"><span class="begin">'+theBus[i]['发车时间']+'</span><span class="id">#'+theBus[i]['车号']+'</span><div class="detail"><hr><span class="end">到站时间：'+theBus[i]['到站时间']+'</span><br><span class="date">'+theBus[i]['运行时间']+'</span><br><span class="place">'+theBus[i]['停靠地点']+'</span></div></div>';
        }
        $('#bus_info').html(s);
    }
}

var xiaoCheData;

if (localStorage.getItem('xiaoChe')) {
    xiaoCheData = JSON.parse(localStorage.getItem('xiaoChe'));
    loadBusInfo();
} else {
    myGetJsonp('xiaoche', true, function(data) {
        if(!data) return;
        xiaoCheData = data;
        localStorage.setItem('xiaoChe', JSON.stringify(xiaoCheData));
        loadBusInfo();
    });
}

$('#xiaoche select').bind("change", function() {
    loadBusInfo();
});
