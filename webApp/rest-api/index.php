<?php
ini_set('display_errors',1);

require __DIR__ . "/inc/bootstrap.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/',$uri);

if((isset($uri[2]) && $uri[2] != 'datos') || !isset($uri[3])){
    header("HTTP/1.1 404 not found");
    exit();
}

require PROJECT_ROOT_PATH . "/control/dataControl.php";

$objFeedController =  new DataController();
$strMethodName = $uri[3] . 'Action';
$objFeedController->{$strMethodName}();
?>