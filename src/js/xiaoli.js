function loadXiaoli() {
    if(typeof(xiaoliData) == "undefined") {
        (function() {

            // $('#xiaoli_notice').on('click', 'ul > li', function() {
            //     var id = $(this).attr('id').replace("notice_id_", "");
            //     $(this).find('.content').toggle();
            //     loadNoticeDetail(id);
            // });

            getData('share/shijian', function(data){
                xiaoliData = data;
                loadShijian();
            });
        })();
    }
}
function loadShijian() {
    var htmlImportant = '', htmlVacation = '', htmlExam = '';
    // 汇总
    for(var i=0; i<xiaoliData.length; i++) {
        var item = xiaoliData[i];
        var content = item['事件内容'];
        var type = item['事件类型'];
        var begin = item['起始时间'];
        var end = item['终止时间'];
        // 循环，同时对四个dom写入

        if(type == '重要事件')
          htmlImportant += '<li><div class="content">'+content+'</div><div class="begin">'+begin+'</div><div class="end">'+end+'</div></li>';
        if(type == '放假')
          htmlVacation += '<li><div class="content">'+content+'</div><div class="begin">'+begin+'</div><div class="end">'+end+'</div></li>';
        if(type == '考试')
          htmlExam += '<li><div class="content">'+content+'</div><div class="begin">'+begin+'</div><div class="end">'+end+'</div></li>';
    }


    $('#xiaoli_important ul').html(htmlImportant);
    $('#xiaoli_vacation ul').html(htmlVacation);
    $('#xiaoli_exam ul').html(htmlExam);
}