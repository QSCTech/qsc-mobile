// zeno: i modified it for my project

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
        var s, temp = [];
        cssRules = [];
        styledElements = [];

        for(var i=0; i < document.styleSheets.length; i++) {
            var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
            for(var j=0; j < rules.length; j++) {
                var rule = rules[j].cssText;
                temp.push(rule);
            }
        }

        for(i = 0; i < temp.length; i++) {
            if(temp[i].length > 0) {
                cssRules.push(parseRule(temp[i]));
            }
        }
        updateCSS();
    };

    function updateCSS() {
        var stylesheet = '',
            matcher = /^\s*([a-z-]+)\s*\:\s*(([0-9.]+)(vw|vh|vm))\s*$/,
            oldStyle = document.querySelectorAll('style#' + relativeUnitsStylesheetID),
            newStylesheet = null,
            i, j, a, v, n, d, styleProp, newProps;

        /* Process the CSS rules */
        for(i = 0; i < cssRules.length; i++) {
            for(j = 0; j < cssRules[i].attr.length; j++) {
                a = cssRules[i].attr[j];
                v = a.match(matcher);
                n = 0;
                if(matcher.test(a)) {
                    // we're dealing with a relative unit
                    n = parseFloat(v[3], 10);
                    switch(v[4]) {
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
                    stylesheet += cssRules[i].selector + ' { ' + v[1] + ' : ' + (n * d) / 100 + 'px }\n';
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

        /* Process the styled elements */
        for(i = 0; i < styledElements.length; i++) {
            styleProp = trim(clean(styledElements[i].getAttribute('style').replace(/\/\*×\*\/.*/g, ''))).split(';');
            newProps = [];
            for(j = 0; j < styleProp.length; j++) {
                a = styleProp[j];
                v = a.match(matcher);
                n = 0;
                if(matcher.test(a)) {
                    // we're dealing with a relative unit
                    n = parseFloat(v[3], 10);
                    switch(v[4]) {
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
                    newProps.push(v[1] + ' : ' + (n * d) + 'px');
                }
            }
            styledElements[i].setAttribute('style', (styleProp.join(';') + ';/*×*/' + newProps.join(';')).replace(/;+/g, ';'));
        }
    };


    window.addEventListener('resize', function() { updateCSS(); });
    window.addEventListener('load', function() { refreshRules(); });

    return {
        update: refreshRules,
        recalculate: updateCSS
    };
}());