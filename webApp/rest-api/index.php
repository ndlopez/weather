<?php
ini_set('display_errors',1);

require __DIR__ . "/inc/bootstrap.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/',$uri);
var_dump("dasis:".$uri[4]);
if((isset($uri[3]) && $uri[3] != 'datos') || !isset($uri[4])){
    header("HTTP/1.1 404 not found :(");
    //var_dump("Something 2:".$uri[3]."3:").$uri[4];
    exit();
}

require PROJECT_ROOT_PATH . "/control/dataControl.php";

$objFeedController =  new DataController();
$strMethodName = $uri[4] . 'Action';
$objFeedController->{$strMethodName}();
?>