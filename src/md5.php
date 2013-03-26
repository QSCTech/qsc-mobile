<?php
if(isset($_REQUEST['hide']) && $_REQUEST['hide'] == 't') {
    $hide = true;
}
function echo_md5($file) {
    global $hide;
    if($hide) {
        echo "$file\n";
    } else {
        echo md5_file($file) . "  $file\n";
    }
    return 0;
}

// root 
foreach (array('config.xml', 'index.html', 'main.html') as $val) {
    echo_md5($val);
}

// child
foreach (array('css', 'img', 'js') as $dir) {
    foreach(scandir($dir) as $file) {
        if($file == '.') continue;
        if($file == '..') continue;
        if(strpos($file, '~') !== FALSE) continue;
        if(strpos($file, '#') !== FALSE) continue;
        if(strpos($file, 'src.js') !== FALSE) continue;
        if(strpos($file, '.less') !== FALSE) continue;
        if(strpos($file, '.css') !== FALSE) {
            if($file !== 'styles.css') {
                continue;
            }
        }
        echo_md5($dir.'/'.$file);
    }
}
