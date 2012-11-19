var chengJiData;

function loadChengji(){
    var chengJiArray = chengJiData['chengji_array'];
    var gpa = chengJiData['junji_array'];

    var html = '';
    for(var i = 0; i < chengJiArray.length; i++) {
        html += '<div class="chengji>';
        html += '<div class="name">' + chengJiArray[i]['课程名称'] + '</div>';
        html += '<div class="score">成绩：'+chengJiArray[i]['成绩'] + '</div>';
        html += '<div class="credit">学分：'+chengJiArray[i]['学分'] + '</div>';
        html += '<div class="gradepoint">绩点：'+chengJiArray[i]['绩点'] + '</div>';
        html += '</div>';
        html += '<br>';
    }
    $('#chengji #danke .detail').html(html);

    // gpa
    html = '';
    for(i = 0; i < gpa.length; i++) {
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
}

if (localStorage.getItem('chengJi')) {
    chengJiData = JSON.parse(localStorage.getItem('chengJi'));
    loadChengji();
} else {
    myGetJsonp('chengji', true, function(data) {
        if(!data) return;
        chengJiData = data;
        localStorage.setItem('chengJi', JSON.stringify(chengJiData));
        loadChengji();
    });
}
