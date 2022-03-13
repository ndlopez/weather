<?php
header("Content-type:application/json;charset=UTF-8");

$dbhost = "127.0.0.1:3306";
$dbname = "weather";
$dbuser = "root";
$dbpass = "";
//when coding on the server side, should use root not kathy;

$connect = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);

if(mysqli_connect_errno()){
die("Could not connect to DB".mysqli_connect_error());
}
$newQuery="SELECT * FROM tenki WHERE date='2022-03-11';";
//$array = Array new;
if($res =mysqli_query($connect,$newQuery)){
foreach ($res as $dat){
$json = $dat;
var_dump($dat);
}
}
$json = json_encode($json);
file_put_contents("static/all_weather.json",$json);
mysqli_close($connect);
?>
