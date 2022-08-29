<?php
ini_set('display_errors',1);
$dbTable="weather_data";
require "../config/connect.php";
//function index(){}
global $conn;
$query = $conn->query("SELECT * FROM $dbTable WHERE date='2022-08-26' ORDER BY hour ASC LIMIT 5");
$result = $query->fetchAll();

echo "<b>Index Page</b> (Total number of results: ".$query->rowCount()." )</br>";
foreach($result as $obj){
    echo "</br>".$obj['date']." ".$obj['hour']." ".$obj['weather']."</br>";
}