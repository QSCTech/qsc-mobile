for(var i = 0; i < config_list.length; i++) {

    $('#config_'+item).attr("class", config[item]);

    $('#config_'+item).click(function() {
        config[item] = !config[item];
        localStorage.setItem('config', JSON.stringify(config));
        $('#config_'+item).attr("class", config[item]);
    });
}
