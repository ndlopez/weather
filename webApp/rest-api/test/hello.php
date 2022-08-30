<?php
header("Access-Control-Allow-Origin: *");

//get request method
$method = $_SERVER['REQUEST_METHOD'];
if($method == 'GET'){
    printf("this is a get request");
}
if($method == 'POST'){
    printf("this is a post request");
}
if($method == 'PUT'){
    printf("this is a put request");
}
if($method == 'DELETE'){
    printf("this is a DEL request");
}
?>