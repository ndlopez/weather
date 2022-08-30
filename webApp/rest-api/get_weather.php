<?php
ini_set('display_errors',1);
$dbTable="weather_data";
require "../config/connect.php";

function index($in_date){
    global $conn;
    $query = $conn->query("SELECT * FROM $dbTable WHERE date=$in_date ORDER BY hour ASC LIMIT 5");
    $result = $query->fetchAll();

    //echo "<b>Index Page</b> (Total number of results: ".$query->rowCount()." )</br>";
    foreach($result as $obj){
        return $obj['hour'].$obj['weather'];
        //echo "</br>".$obj['date']." ".$obj['hour']." ".$obj['weather']."</br>";
    }
}