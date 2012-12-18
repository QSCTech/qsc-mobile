<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

// 判断useragent
$ua = $_SERVER['HTTP_USER_AGENT'];

if (stripos( $ua, 'Apple-iPhone' ) !== FALSE) {
    header('Location: mobile.ipa');
} elseif (stripos( $ua, 'Apple-iPad' ) !== FALSE) {
    header('Location: mobile.ipa');
} elseif (stripos( $ua , 'Android' ) !== FALSE) {
    header('Location: mobile.apk');
} else {
    header('Location: download.html');
}
exit;

/* if (stripos( $ua, 'Windows Phone' ) !== FALSE) { */
/*     header('https://build.phonegap.com/apps/245666/download/winphone'); */
/* } elseif (stripos( $ua, 'SymbianOS' ) !== FALSE) { */
/* } elseif (stripos( $ua, 'Apple-iPhone' ) !== FALSE) { */
    
/* } elseif (stripos( $ua, 'Apple-iPad' ) !== FALSE) { */

/* } elseif (stripos( $ua , 'Android' ) !== FALSE) { */
/*     header('Location: mobile_QSC.apk'); */
/* } else { */
/*     header('Location: all-app.html'); */
/* } */