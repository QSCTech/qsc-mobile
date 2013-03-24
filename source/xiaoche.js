function loadXiaoche(){
    getData('share/xiaoche', function(xiaoCheData) {
        window.xiaoCheData = xiaoCheData;
        if(!xiaoCheData)
          return;
        loadXiaocheInfo(xiaoCheData);
        (function() {
            $('#xiaoche select').unbind("change");
            $('#xiaoche select').bind("change", function() {
                loadXiaocheInfo(xiaoCheData);
            });
        })()
    });
}
function loadXiaocheInfo(xiaoCheData) {
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
            s += '<div class="bus_info"><header><span class="begin">'+theBus[i]['发车时间']+'</span><span class="id">#'+theBus[i]['车号']+'</span></header><div class="detail"><span class="end">到站时间：'+theBus[i]['到站时间']+'</span><br><br><span class="date">'+theBus[i]['运行时间']+'</span><br><br><span class="place">'+theBus[i]['停靠地点']+'</span></div></div>';
        }
        $('#bus_info').html(s);
    }
}