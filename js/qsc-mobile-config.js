var config = localStorage.getItem('config') ? JSON.parse(localStorage.getItem('config')) : {};
var config_list = ['update_automatically'];

for(var i = 0; i < config_list.length; i++) {

    var item = config_list[i];

    if(typeof(config[item]) == "undefined")
        config[item] = false;

    $('#config_'+item).attr("class", config[item]);

    $('#config_'+item).click(function() {
        config[item] = !config[item];
        localStorage.setItem('config', JSON.stringify(config));
        $('#config_'+item).attr("class", config[item]);
    });
}
