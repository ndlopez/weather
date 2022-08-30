<?php
ini_set('display_errors',1);

require "../config/connect.php";

//$myVal='2022-08-29';
function index($myVal){    
    global $conn;
    $dbTable="weather_data";
    $query = $conn->query("SELECT * FROM $dbTable WHERE date='$myVal' ORDER BY hour ASC LIMIT 2");
    $result = $query->fetchAll();

    //echo "<b>Index Page</b> (Total number of results: ".$query->rowCount()." )</br>";
    //return json_encode($result);
    foreach($result as $obj){
        $got_data=$obj['temp'];
        //echo "</br>".$obj['date']." ".$obj['hour']." ".$obj['weather']."</br>";
    }
    return $got_data;
}

//echo index($myVal);