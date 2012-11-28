$(document).ready(function(){
    $('#add_homework_button').bind('click', function() {
        $('#add_homework').toggle();
        document.getElementById('add_homework_textarea').focus();
    });
});