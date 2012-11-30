var shareHomework = true;
var zuoYeData;

if (localStorage.getItem('zuoYe')) {
    zuoYeData = JSON.parse(localStorage.getItem('zuoYe'));
    loadZuoYe();
} else {
    myGetJsonp('zuoye', true, function(data) {
        if(!data) return;
        zuoYeData = data;
        localStorage.setItem('zuoYe', JSON.stringify(zuoYeData));
        loadZuoYe();
    });
}
if(typeof(keBiaoData) != "undefined") {
    // already defined
} else if (localStorage.getItem('keBiao')) {
    keBiaoData = JSON.parse(localStorage.getItem('keBiao'));
} else {
    myGetJsonp('kebiao', true, function(data) {
        if(data) {
            keBiaoData = data;
            localStorage.setItem('keBiao', JSON.stringify(keBiaoData));
        }
    });
}

var html = '';
for(var i=0; i<keBiaoData.length; i++) {
    var item = keBiaoData[i];
    html += '<option value="'+item.namea+'">'+item.name+'</option>';
    $('#add_homework_course').html(html);
}

$(document).ready(function(){
    $('#share_homework').attr('class', shareHomework);


    $('#add_homework_button').bind('click', function() {
        $('#add_homework').toggle();
        document.getElementById('add_homework_textarea').focus();
    });
    $('#share_homework').bind('click', function() {
        shareHomework = !shareHomework;
        $('#share_homework').attr('class', shareHomework);
    });
    $('add_homework_submit').bind("click", function() {
        var homework_content = $('#add_homework_textarea').val();
        var homework_share = $('#share_homework').attr('class');
//        var homework_course = $()
    });
});

function loadZuoYe() {
    var md5;
}
