function loadChengji() {
    getData('jw/chengji', function (chengJiData) {
        var chengJiArray = chengJiData['chengji_array'],
            gpa = chengJiData['junji_array'],
            html = '',
            i;
        for (i = chengJiArray.length - 1; i > -1; i--) {
            html += '<div class="chengji>';
            html += '<div class="name">' + chengJiArray[i]['课程名称'] + '</div>';
            html += '<div class="score">成绩：' + chengJiArray[i]['成绩'] + '</div>';
            html += '<div class="credit">学分：' + chengJiArray[i]['学分'] + '</div>';
            html += '<div class="gradepoint">绩点：'+chengJiArray[i]['绩点'] + '</div>';
            html += '</div>';
            html += '<br>';
        }
        $('#chengji #danke .detail').html(html);

        // gpa
        html = '';
        gpa.push(gpa.shift());
        for(i = gpa.length - 1; i > -1; i--) {
            html += '<div class="gpa">';
            html += '<div class="date">';
            html += gpa[i]['时间'];
            html += '</div>';
            html += '<div class="junji">均绩：';
            html += gpa[i]['均绩'];
            html += '</div>';
            html += '<div class="zongxuefen">总学分：';
            html += gpa[i]['总学分'];
            html += '</div>';
            html += '</div>';
        }
        $('#gpa .detail').html(html);
    });
}
