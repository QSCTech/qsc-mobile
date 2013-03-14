<?php
$content = file_get_contents('feedback.log');
$content = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
echo '<!doctype>';
echo '<meta charset="utf-8">';
echo '<pre>';
echo $content;
echo '</pre>';
?>