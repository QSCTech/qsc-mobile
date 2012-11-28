var shareHomework = true;
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