/**
 * @author Zeno Zeng
 * @desc fetch the Data
 * @example updateData('jw/kebiao');
 */
function fetchData(item, success, error) {
    error = typeof(error) == 'function' ? error : function(msg) {return;};
    success = typeof(success) == 'function' ? success : function(msg) {return;};
    if(!navigator.onLine) {
        if(typeof(error) == 'function') {
            error('好的嘛，这是已经离线的节奏……');
        }
        return;
    }
    var baseUrl = branch == "dev" ? 'http://m.myqsc.com/dev/' :'http://m.myqsc.com/stable/';
    var params = [];
    if(item.indexOf('jw/') != -1) {
        params = [
          'stuid='+stuid,
          'pwd='+pwd
        ];
    }
    var jsonUrl = baseUrl + item +'?' + params.join('&') + '&callback=?';
    $.jsonP({url:jsonUrl,
             success:function(data){
                 if(typeof(data['code']) != "undefined") {
                     if(data['code'] == 0) {
                         // 远端返回错误
                         error(data['msg']);
                         return;
                     }
                     if(data['code'] == 1) {
                         // 远端返回消息
                         error(data['msg']);
                         // 再次访问远端来获取内容（递归）
                         updateData(item, success, error);
                     } else {
                         // 未知情况
                         return;
                     }
                 } else {
                     success(data);
                 }
             },
             error:function() {
                 error('好的嘛，好像有什么错误？');
             }
            });
}
/**
 * @author Zeno Zeng
 * @desc get the data and automatically update, by default, it will show all the errors
 * @example getData('jw/kebiao');
 */
function getData(item, success, error) {
    error = typeof(error) == 'function' ? error : function(e) {showMsg(e);};
    success = typeof(success) == 'function' ? success : function(msg) {return;};
    if(isTempLogin) {
        fetchData(item, success, error);
    } else {
        var data = localStorage.getItem(item);
        if(!data) {
            fetchData(item, function(data){
                success(data);
                localStorage.setItem(item, JSON.stringify(data));
            }, error)
        } else {
            success(JSON.parse(data));
        }
    }
}
/**
 * @author Zeno Zeng
 * @desc 模块更新，注意stuid & pwd 可能会因为tempLogin而改变(在回调执行时)，这里先在载入前直接写入stuid和pwd。12小时内不重复check。
 * @example updateModule('jw');
 */
var updateModule = (function(stuid, pwd) {
    return function(module) {
        var lastUpdate = localStorage.getItem('lastUpdate'+module);
        if(!lastUpdate) lastUpdate = 0;
        if((new Date()).getTime() - lastUpdate < 12*3600*1000) {
            return;
        }
        fetchData(module+'/hash', function(data) {
            var item, i = 0;
            for(item in data) {
                if(typeof(hash[item]) == "undefined" || hash[item] != data[item]) {
                    i++;
                    var callback = (function(item) {
                        return function(newdata) {
                            hash[item] = data[item];
                            localStorage.setItem('hash', JSON.stringify(hash));
                            newdata = JSON.stringify(newdata);
                            if(newdata.length > 2) {
                                localStorage.setItem(module+'/'+item, newdata);
                            }
                        }
                    })(item);
                    fetchData(module+'/'+item, callback);
                }
            }
            if(i == 0) {
                localStorage.setItem('lastUpdate'+module, (new Date()).getTime());
            }
        });
    }
})(stuid, pwd);
/**
 * @author Zeno Zeng
 * @desc check all the update, if the hash changed and the data is valid, update
 */
function updateData() {
    window.hash = localStorage.getItem('hash');
    window.hash = window.hash ? JSON.parse(window.hash) : {};

    updateModule('share');
    if(isLogin && !isTempLogin) {
        updateModule('jw');
    }
}
/**
 * @author Zeno Zeng
 * @desc show a layyer above all
 */
function showMsg(msg, callback) {
    $('#msg').show();
    $('#msg').html(msg);
}
/**
 * @author Zeno Zeng
 */
function showLogin(callback) {
    $(currentLayout).hide();
    $('#login').show();

    $('#login_form').bind("submit", function() {
        stuid = $("#stuid").val();
	pwd = $("#pwd").val();

        if(!isTempLogin) {
            localStorage.setItem('stuid', stuid);
            localStorage.setItem('pwd', pwd);
        }

	fetchData('jw/validate',
		function(data){
		    if(data['stuid'] != '') {
			$('#login').hide();
                        if(!isTempLogin) {
                            isLogin = true;
			    $('#menu-login').html('注销');
			    $('#menu-login').attr('id','menu-logout');
                        }
			if(typeof(callback) == 'function') {
			    callback();
			}
		    } else {
			showMsg('登录失败');
                        stuid = localStorage.getItem('stuid');
                        pwd = localStorage.getItem('pwd');
		    }
		},
		function(msg) {
		    showMsg(msg);
                    stuid = localStorage.getItem('stuid');
                    pwd = localStorage.getItem('pwd');
		});
	return false;
    });
}
/**
 * @author Zeno Zeng
 */
function pleaseLoginIfNotLogin(callback) {
    if(isLogin || isTempLogin) {
        if(typeof(callback) == 'function') {
            callback();
        }
    } else {
        showLogin(callback);
    }
}
/**
 * @author Chris Nielsen
 * @desc format the number to LENGTH 2
 */
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
/**
 * @author Zeno Zeng
 * @desc format the Time Delta to H:m or m:s
 */
function formatTimeDelta(seconds) {
    var hours = parseInt(seconds / 3600),
        minutes = parseInt(seconds % 3600 / 60);
    seconds = parseInt(seconds % 60);
    return hours > 0 ? pad(hours)+':'+pad(minutes)+':'+pad(seconds) : pad(minutes)+':'+pad(seconds);
}