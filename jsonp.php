<?php
function echo_jsonp ($file) {
  echo '('.file_get_contents($file).')';
}
header("Content-type: text/javascript");
if($_REQUEST['data'] == 'bus')
  echo_jsonp('json/bus.json');