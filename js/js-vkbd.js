var vkbdKeys = [["`",1,2,3,4,5,6,7,8,9,0,"-","="],
                ["q","w","e","r","t","y","u","i","o","p","[","]","\\"],
                ["a","s","d","f","g","h","j","k","l",";","'"],
                ["z","x","c","v","b","n","m",",",".","/"]]

var vkbdShiftKeys = [["~","!","@","#","$","%","^","&","*","(",")","_","+"],
                     ["Q","W","E","R","T","Y","U","I","O","P","{","}","|"],
                     ["A","S","D","F","G","H","J","K","L",":",'"'],
                     ["Z","X","C","V","B","N","M","<",">","?"]]

var vkbdIfShift = false;

var vkbdTarget;

if(document.readyState=="complete") {
    vkbdAutoFocus();
    vkbdInit();
} else {
    document.onreadystatechange = function() {
        if(document.readyState=="complete") {
            vkbdAutoFocus();
            vkbdInit();
        }
    }
}


function vkbdAutoFocus() {
    var o = document.getElementById("vkbd_user");

    o.className += " vkbd_focus";
    o.childNodes[1].className += ' vkbd_cursor';
    vkbdTarget = o;
}

function vkbdInit() {
    var dom = document.getElementsByName("vkbd_line");
    for(var i=0; i<4; i++) {
        var theKeys = vkbdIfShift ? vkbdShiftKeys : vkbdKeys;
        var html = '<ul>';
        for(var j=0; j < theKeys[i].length; j++) {
            var key = theKeys[i][j];
            if(key == '\\')
              html += '<li onclick="vkbdKeyDown(\''+'\\\\'+'\');">\\</li>';
            else if(key == "'")
              html += "<li onclick=\"vkbdKeyDown(\'\\'\');\">\'</li>";
            else
              html += '<li onclick="vkbdKeyDown(\''+theKeys[i][j]+'\');">'+theKeys[i][j]+'</li>';
        }
        html += '</ul>';
        dom[i].innerHTML = html;
    }
    // document.getElementsByName("kb_line").
}

function vkbdInput(key) {
    vkbdTarget.childNodes[0].innerHTML += key;
}

function vkbdKeyDown(key){
    var e = window.event || e;
    var o = e.srcElement || e.target;
    var ori = o.className;
    o.className = ori == '' ? 'vkbd_key_down' : ori + 'vkbd_key_down';
    setTimeout(function(){
        o.className = ori;
    }, 150);

    vkbdInput(key);
}

function vkbdShift () {
    vkbdIfShift = !vkbdIfShift;
    vkbdInit();
}
function vkbdFocus() {
    var e = window.event || e;
    var o = e.srcElement || e.target;

    if(o.className == 'vkbd_text')
      return;

    if(typeof(vkbdTarget) != "undefined") {
        vkbdTarget.className = vkbdTarget.className.replace(' vkbd_focus', '');
        vkbdTarget.childNodes[1].className = vkbdTarget.childNodes[1].className.replace(' vkbd_cursor', '');
    }

    o.className += " vkbd_focus";
    o.childNodes[1].className += ' vkbd_cursor';
    vkbdTarget = o;
}

function vkbdBackspace() {
    var str = String(vkbdTarget.childNodes[0].innerHTML);
    vkbdTarget.childNodes[0].innerHTML = str.substring(0, str.length - 1)
}