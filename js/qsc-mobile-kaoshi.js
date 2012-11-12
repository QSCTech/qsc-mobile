pleaseLoginIfNotLogin();

var kaoShiData;

function loadKaoShi() {
    var html;
    $('#kaoshi_detail').html(html);
}

if (localStorage.getItem('kaoShi')) {
    kaoShiData = JSON.parse(localStorage.getItem('kaoShi'));
    loadKaoShi();
} else {
    $.getJSON(siteUrl+'/jsonp/kaoshi?stuid='+stuid+'&pwd='+pwd+'&callback=?', function(data) {
        kaoShiData = data;
        localStorage.setItem('kaoShi', JSON.stringify(kaoShiData));
        loadKaoShi();
    });
}