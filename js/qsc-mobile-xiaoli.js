function loadXiaoLi() {
}

if (localStorage.getItem('xiaoLi')) {
    xiaoLiData = JSON.parse(localStorage.getItem('xiaoLi'));
    loadXiaoLi();
} else {
    myGetJsonp('calendar', true, function(data) {
        if(!data) return;
        xiaoLiData = data;
        localStorage.setItem('xiaoLi', JSON.stringify(xiaoLiData));
        loadXiaoLi();
    });
}
