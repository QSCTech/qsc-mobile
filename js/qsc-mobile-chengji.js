var chengJiData;

function loadChengji(){
    var chengJiArray = chengJiData['chengji_array'];
    var gpa = chengJiData['junji_array'];
    
    var html = '';
    for(var i = 0; i < chengJiArray.length; i++) {
        html += '<div class="chengji>';
        html += '<div class="name">';
        html += chengJiArray[i]['课程名称'];
        html += '</div>';
        html += '<div class="score">';
        html += '成绩：'+chengJiArray[i]['成绩'];
        html += '</div>';
        html += '<div class="credit">';
        html += '学分：'+chengJiArray[i]['学分'];
        html += '</div>';
        html += '<div class="gradepoint">';
        html += '绩点：'+chengJiArray[i]['绩点'];
        html += '</div>';
        html += '</div>';
    }
    $('#chengji #danke .detail').html(html);

    // gpa
    var html = '';
    for(var i = 0; i < gpa.length; i++) {
        html += '<div class="gpa">';
        html += '<div class="date">';
        html += gpa[i]['时间'];
        html += '</div>';
        html += '<div class="junji">';
        html += gpa[i]['均绩'];
        html += '</div>';
        html += '<div class="zongxuefen">';
        html += gpa[i]['总学分'];
        html += '</div>';
        html += '</div>';
    }
    $('#gpa .detail').html(html);
    $('#gpa header').click();
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
