var chengJiData;

function loadChengji(){
    var html = '';
    for(var i = 0; i < chengJiData.length; i++) {
        html += '<div class="chengji>';
        html += '<div class="name">';
        html += chengJiData[i]['课程名称'];
        html += '</div>';
        html += '<div class="score">';
        html += '成绩：'+chengJiData[i]['成绩'];
        html += '</div>';
        html += '<div class="credit">';
        html += '学分：'+chengJiData[i]['学分'];
        html += '</div>';
        html += '<div class="gradepoint">';
        html += '绩点：'+chengJiData[i]['绩点'];
        html += '</div>';
        html += '</div>';
    }
    $('#gpa header').click();
    $('#chengji #danke .detail').html(html);
}

if (localStorage.getItem('chengJi')) {
    chengJiData = JSON.parse(localStorage.getItem('chengJi'));
    loadChengji();
} else {
    myGetJsonp('chengji', function(data) {
        if(!data) return;
        chengJiData = data;
        localStorage.setItem('chengJi', JSON.stringify(chengJiData));
        loadChengji();
    });
}
