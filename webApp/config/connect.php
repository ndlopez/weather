<?php

$DB_HOST = "webapp.physics";
$DB_NAME = "tenki";
$DB_USER = "root";
$DB_PASS = "gWloF1Uk";

try {
    $conn = new PDO("mysql:host=$DB_HOST;port=3306;dbname=$DB_NAME",$DB_USER,$DB_PASS);
    $conn -> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    $conn -> setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
}
catch(PDOException $e){
    echo "connection failed: ".$e->getMessage();
}