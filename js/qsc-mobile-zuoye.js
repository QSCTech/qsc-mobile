var shareHomework = true;
var zuoYeData;
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



});

function loadZuoYe() {
    var md5;
}

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
