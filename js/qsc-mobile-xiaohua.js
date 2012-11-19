var xiaoHuaData;

function loadXiaoHua(){
    myGetJsonp('xiaohua', true, function(data) {
        if(!data)
            myShowMsg('好的嘛，拉取数据失败……');

        xiaoHuaData = data;
        var content = xiaoHuaData['content'];
        $('#xiaohua .content').html(content);
        $('#xiaohua .love').attr('class', 'love '+xiaoHuaData['whether_like']);
    });

}

$(document).ready(function(){
    loadXiaoHua();

    $('#xiaohua .next')bind("click", function(){
        loadXiaoHua();
    });

    $('#xiaohua .love')bind("click", function(){
        xiaoHuaData['whether_like'] = !xiaoHuaData['whether_like'];

        // request to 远端
        if(xiaoHuaData['whether_like'])
          $.jsonP({url:siteUrl+'/app/like_joke/'+xiaoHuaData['joke_id']+'?stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?'});
        else
          $.jsonP({url:siteUrl+'/app/dislike_joke/'+xiaoHuaData['joke_id']+'?stuid='+stuid+'&pwd='+pwd+'&token='+token+'&callback=?'});

        $(this).attr('class', 'love '+xiaoHuaData['whether_like']);
    });
});
