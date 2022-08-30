<?php
ini_set('display_errors',1);

header("Content-Type:application/json");
//require "sample.php";

require "get_weather.php"

if(!empty($_GET['tag'])){
    //prod: entry point
    //$name = $_GET['prod'];
    //$price = get_price($name);

    $myVal = $_GET['tag']
    //var_dump($myVal->format('Y-m-d'));
    $got_data = index($myVal->format('Y-m-d'));

    if(empty($got_data)){
        my_response(200,"Data not found",NULL);
    }else{
        my_response(200,"Found data",$got_data);
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