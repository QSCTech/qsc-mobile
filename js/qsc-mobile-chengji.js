pleaseLoginIfNotLogin();

var chengJiData;

function loadChengji(){}

if (localStorage.getItem('chengJi')) {
    chengJiData = JSON.parse(localStorage.getItem('chengJi'));
    loadChengji();
} else {
    $.getJSON(siteUrl+'/jsonp/chengji?stuid='+stuid+'&pwd='+pwd+'&callback=?', function(data) {
        chengJiData = data;
        localStorage.setItem('chengJi', JSON.stringify(chengJiData));
        loadChengji();
    });
}
