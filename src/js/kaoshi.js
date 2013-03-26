function loadKaoshi() {
    getData('jw/kaoshi', function(kaoshiData) {
        var html = '';
        for(var i = 0; i<kaoshiData.length; i++) {
            var item = kaoshiData[i];
            if(item['课程名称'] == '军训')
              continue;
            if(item['考试时间'] == ' ') //考试时间为空
              continue;

            // 不显示过期的考试
            var time = item['考试时间'];
            time = time.replace(/\(.*$/, '');
            time = time.replace(/(年|月)/g, '-');
            time = time.replace(/日/g, '');
            time = new Date(time+' 23:59');

            var today = new Date();

            if(today.getTime() > time.getTime())
              continue;

            html += '<div class="kaoshi">';
            html += '<div class="name">';
            html += item['课程名称'];
            html += '</div>';
            html += '<div class="time">';
            html += item['考试时间'];
            html += '</div>';
            html += '<div class="credit">';
            html += '学分：'+item['学分'];
            html += '</div>';
            html += '<div class="place">';
            html += '考试地点：'+item['考试地点'];
            html += '</div>';
            html += '<div class="place_id">';
            html += '考试座位号：'+item['考试座位号'];
            html += '</div>';
            html += '<div class="re">';
            html += '重修标记：'+item['重修标记'];
            html += '</div>';
            html += '</div>';
        }
        $('#kaoshi_detail').html(html);
    });
}
