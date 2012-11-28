<?php
function echo_md5($file) {
    echo md5_file($file) . "  $file\n";
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

        echo_md5($dir.'/'.$file);
    }
}
