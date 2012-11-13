var chengJiData;

function loadChengji(){}

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
