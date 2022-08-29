<?php
ini_set('display_errors',1);

header("Content-Type:application/json");
require "sample.php";


if(!empty($_GET['name'])){
    $name = $_GET['name'];
    $price = get_price($name);

    if(empty($price)){
        my_response(200,"Product not found",NULL);
    }else{
        my_response(200,"Product found",$price);
    }
}else{
    my_response(400,"Invalid request",NULL);
}

function my_response($status,$status_message,$data){
    header("HTTP/1.1".$status);
    $response['status']=$status;
    $response['status_message']=$status_message;
    $response['data']=$data;

    $json_response = json_encode($response);
    echo $json_response;
}