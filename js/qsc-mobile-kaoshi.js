var kaoShiData;

function loadKaoShi() {
    var html;
    $('#kaoshi_detail').html(html);
}

if (localStorage.getItem('kaoShi')) {
    kaoShiData = JSON.parse(localStorage.getItem('kaoShi'));
    loadKaoShi();
} else {
    myGetJsonp('kaoshi', function(data) {
        if(!data) return;
        kaoShiData = data;
        localStorage.setItem('kaoShi', JSON.stringify(kaoShiData));
        loadKaoShi();
    });
}