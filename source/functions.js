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
 * @desc get the data and automatically update
 * @example getData('jw/kebiao');
 */
function getData(item, success, error) {
    error = typeof(error) == 'function' ? error : function(msg) {return;};
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
 * @desc check all the update, if the hash changed and the data is valid, update
 */
function updateData() {
    var hash = localStorage.getItem('hash');
    hash = hash ? JSON.parse(hash) : {};
    var stuid = localStorage.getItem('stuid');
    var pwd = localStorage.getItem('pwd');
    var isValid = function(obj) {
        return JSON.stringify(obj).length > 2 ? true : false;
    }
    // stuid & pwd 可能会因为tempLogin而改变(在回调执行时)，这里先直接载入数据
    var updateModule = (function(stuid, pwd) {
        return function(module) {
            fetchData(module+'/hash', function(data) {
                var item;
                for(item in data) {
                    if(typeof(hash[item]) == "undefined" || hash[item] != data[item]) {
                        // 注意回调之后item变量改变，所以在这里先用函数构造函数
                        var callback = (function(item) {
                            return function(newdata) {
                                hash[item] = data[item];
                                localStorage.setItem('hash', JSON.stringify(hash));
                                if(isValid(newdata)) {
                                    localStorage.setItem(module+'/'+item, JSON.stringify(newdata));
                                }
                            }
                        })(item);
                        fetchData(module+'/'+item, callback);
                    }
                }
            });
        }
    })(stuid, pwd);
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