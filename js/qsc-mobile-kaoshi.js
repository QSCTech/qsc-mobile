var kaoShiData;

function loadKaoShi() {
    var html = '';
    for(var i = 0; i<kaoShiData.length; i++) {
        if(kaoShiData[i]['课程名称'] == '军训')
            continue;
        if(kaoShiData[i]['考试时间'] == ' ') //考试时间为空
            continue;

        html += '<div class="kaoshi">';
        html += '<div class="name">';
        html += kaoShiData[i]['课程名称'];
        html += '</div>';
        html += '<div class="time">';
        html += kaoShiData[i]['考试时间'];
        html += '</div>';
        html += '<div class="credit">';
        html += '学分：'+kaoShiData[i]['学分'];
        html += '</div>';
        html += '<div class="place">';
        html += '考试地点：'+kaoShiData[i]['考试地点'];
        html += '</div>';
        html += '<div class="place_id">';
        html += '考试座位号：'+kaoShiData[i]['考试座位号'];
        html += '</div>';
        html += '<div class="re">';
        html += '重修标记：'+kaoShiData[i]['重修标记'];
        html += '</div>';
        html += '</div>';
    }
    $('#kaoshi_detail').html(html);
}

if (localStorage.getItem('kaoShi')) {
    kaoShiData = JSON.parse(localStorage.getItem('kaoShi'));
    loadKaoShi();
} else {
    myGetJsonp('kaoshi', function(data) {
        if(!data) return;
        kaoShiData = data;
        localStorage.setItem('kaoShi', true, JSON.stringify(kaoShiData));
        loadKaoShi();
    });
}
