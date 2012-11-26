var RealtiveUnitsTemp = [];
var RealtiveUnitsElms = document.querySelectorAll('link[rel=stylesheet],style,[style]');

window.RelativeUnits =  (function(){
    var API, cssRules, styledElements,
        relativeUnitsStylesheetID = 'relative-units-stylesheet';

    function trim(s) {
        return s.replace(/^\s+|\s+$/, '');
    };

    function clean(s) {
        return s.replace(/\/\*.*?\*\//g, ' ').replace(/\s+/g, ' ').replace(/\}\s*/g, '}\n');
    };

    function parseRule(rule) {
        var r = trim(clean(rule)),
            selector = r.replace(/\{.*$/, ''),
            attrs = r.replace(/.*?\{(.*?)\}/, '$1').split(';'),
            ret = { selector: selector, attr: attrs };
        return ret;
    };

    function refreshRules() {
        var s;
        var refreshCounter = 0;
        cssRules = [];
        styledElements = [];
        for(var i = 0; i < RealtiveUnitsElms.length; i++) {
            if(RealtiveUnitsElms[i].id == relativeUnitsStylesheetID) continue;
            switch(RealtiveUnitsElms[i].nodeName.toLowerCase()) {
                case 'link':
                refreshCounter++;
                var href = RealtiveUnitsElms[i].href;
                $.get(href, function(s){
                    s = trim(clean(s)).split('\n');
                    for(var j = 0; j < s.length; j++) {
                        if(s.length > 0) {
                            RealtiveUnitsTemp.push(s[j]);
                        }
                    }
                    refreshCounter--;
                });
                break;
                case 'style':
                s = RealtiveUnitsElms[i].innerHTML;
                s = trim(clean(s)).split('\n');
                for(var j = 0; j < s.length; j++) {
                    if(s.length > 0) {
                        RealtiveUnitsTemp.push(s[j]);
                    }
                }
                break;
                default:
                // we're dealing with a style attribute
                styledElements.push(RealtiveUnitsElms[i]);
                break;
            }
        }
        var requestDoneCheck = setInterval(function(){

            if(refreshCounter !== 0)
	      return;

            for(i = 0; i < RealtiveUnitsTemp.length; i++) {
                if(RealtiveUnitsTemp[i].length > 0) {
                    cssRules.push(parseRule(RealtiveUnitsTemp[i]));
                }
            }

            updateCSS();
            clearInterval(requestDoneCheck);
        }, 10);
    };

    function updateCSS() {
        var stylesheet = '',
        //            matcher = /^\s*([a-z-]+)\s*\:\s*(([0-9.]+)(vw|vh|vm))\s*$/,
            oldStyle = document.querySelectorAll('style#' + relativeUnitsStylesheetID),
            newStylesheet = null,
            i, j, a, v, n, d, styleProp, newProps, key, value;

        for(i = 0; i < cssRules.length; i++) {
            for(j = 0; j < cssRules[i].attr.length; j++) {
                a = cssRules[i].attr[j];
                v = a.match(/^(.*):(.*)$/);

                if(v != null) {
                    key = v[1];
                    value = v[2];

                    // test if there exists vw || vh || vm
                    var test = value.match(/.*(vw|vh|vm).*/);
                    if(test == null)
                      continue;

                    // replace-regexp
                    var result = value.replace(/([0-9. ]*)(vm|vh|vw)/g, function(arg) {
                        arg.replace(/s*/g, '');

                        var x = arg.match(/([0-9. ]*)(vm|vh|vw)/);
                        n = parseFloat(x[1]);
                        switch(x[2]) {
                            case 'vw':
                            d = window.innerWidth;
                            break;
                            case 'vh':
                            d = window.innerHeight;
                            break;
                            case 'vm':
                            d = Math.min(window.innerWidth, window.innerHeight);
                            break;
                        }
                        return (n * d) / 100 + 'px ';
                    });

                    result = key+':'+result+';';

                    // 替换多余空格（英语捉急）
                    result = result.replace(/ ;/g, ';');
                    result = result.replace(/  /g, ' ');

                    stylesheet += cssRules[i].selector + ' {'+ result +'}\n';

                }
            }
        }
        if(oldStyle != null) {
            for(i = 0; i < oldStyle.length; i++) {
                oldStyle[i].parentNode.removeChild(oldStyle[i]);
            }
        }

        newStylesheet = document.createElement('style');
        newStylesheet.id = relativeUnitsStylesheetID;
        newStylesheet.innerHTML = stylesheet;
        document.querySelector('head').appendChild(newStylesheet);
    };


    window.addEventListener('resize', function() { updateCSS(); });
    window.addEventListener('load', function() { refreshRules(); });

    return {
        update: refreshRules,
        recalculate: updateCSS
    };
}());