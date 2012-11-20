for(var i = 0; i < config_list.length; i++) {
    var item = config_list[i];
    $('#'+item).attr("class", config[item]);
}
$('#config_items li').bind("mousedown", function(){
    var item = $(this).attr('id');
    config[item] = !config[item];
    localStorage.setItem('config', JSON.stringify(config));
    $(this).attr("class", config[item]);
});
