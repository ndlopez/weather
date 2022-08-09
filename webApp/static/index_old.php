<!DOCTYPE html>
<!--Build a nav bar menu https://w3codepen.com/html-css-sticky-navbar-menu/-->
<html lang="en">
<head>
<title>Today's weather</title>
<meta charset="utf-8"/>
<!--meta http-equiv="refresh" content="3600"-->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="static/estilo2.css">
<script src="libs/d3.v4.js"></script>
<script src="static/digi_clock.js"></script>
</head>

<body>
<div class="header">
<h2>Today's weather</h2><h3>Nagoyashi, Naka-ku</h3>

</div>

<nav>
   <ul>
      <li><a target="blank" href="/phpmyadmin">My PHP Admin</a></li>
      <li><a href="/dashboard">LAMP Server</a></li>
      <li><a target="blank" href="https://github.com/ndlopez/weather_app">WebMaster</a></li>
      <li><a href="">Pokemon</a></li>
   </ul>
</nav>

<div class="clearfix">
<?php
$dbTable= weather_data;
date_default_timezone_set("Asia/Tokyo");/*$heure = $heure + 8;*//*Japan*/
$heute = date("Y-m-d");
$heure = date("H");
/*$dbhost = "127.0.0.1:3306";
$dbname = "weather";$dbuser = "root";$dbpass = "";
//when coding on the server side, should use root not kathy;
$conn = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);*/
include_once('myconfig.php');
if(mysqli_connect_errno()){
  die("Could not connect: ". mysqli_connect_error());
  echo "<p>Could not connect to DB</p";
}
else{
  echo "<p>Connection to Database... OK</p>";
}

//$query = "DELETE FROM tenki WHERE date IS NULL;";
$query = "SELECT * FROM $dbTable WHERE date = '" . $heute . "' AND hour = " . $heure .";";
//mysqli_select_db($conn,'weather');

echo "<p> Your Query was ...<br><code>".$query."</code></p>";
?>
</div>
<div class="row" style="padding:0px;">
<div class="column">
<!--div class="container">
<div class="bottom-left"-->
<?php
echo "<h1>".date("l, F d")."</h1><time id='currtime'></time>";
if ($result = mysqli_query($conn,$query)){
	foreach ($result as $row){
		/*echo "<h3><br>".date("l F d ").$row['hour'].":".date("i")."</h3>";*/
		echo "<h1>".$row['weather'].$row['temp']."&#8451</h1>";
	}
	//echo "<p>Rain chance [%]</th><th>Humidity</th><th>Wind [m/s]";
	foreach ($result as $row){
		//var_dump($row);
		echo "<h4>Rain Chance ".$row['rainProb']."% <br>Humidity ".$row['humid'] ."%<br>";
		echo "Wind ".$row['wind']."[m/s]".$row['windDir']."</h4>";
	}
}
else{
  http_response_code(404);
	echo "<p>Something went wrong :( </p>";
}
?>
<!--/div--><!-- bottom-left class: Text above img -->
<!--/div--><!-- container class-->
</div><!-- Column container -->
<!--div class="column" style="text-align:center;">
  <a href="https://tenki.jp/forecast/5/26/5110/23106/1hour.html">
    <img alt="Click  to link tenki.jp" src="https://static.tenki.jp/static-images/radar/recent/pref-26-middle.jpg"/>
  </a>
</div-->
<div id="weather_bar" class="column"></div>
</div><!--Today weather report row-->

<button class="accordion" style="background-color:#2e4054;color:#bed2e0;">Later today</button>
<div class="panel" style="padding:0px;">
<table id="myday">
  <tr>
    <th>Time</th><th>Weather</th>
    <th>Temperature<br>[C]</th>
    <th>Rain chance<br>[%]</th>
    <th>Humidity<br>[%]</th>
    <th>Wind Speed<br>m/s</th>
    <th>Direction</th>
  </tr>
<?php
//Display next hour conditions
echo "";
$heure = $heure +1;
/*$heure=0;*/
$query2 = "SELECT * FROM $dbTable WHERE date = '".$heute."' AND hour BETWEEN ".$heure." AND 23;";

if ($result = mysqli_query($conn,$query2)){
	/*foreach ($result as $row){
		echo "<h3>".$row['hour'].":00 ".$row['weather'].$row['temp']."C</h3>";
	}*/
	foreach ($result as $row){
		//var_dump($row);
		echo "<tr><td>".$row['hour'].":00</td><td>".$row['weather']."</td><td>".$row['temp']."</td>";
		echo "<td>".$row['rainProb']."</td><td>".$row['humid'] ."</td>";
		echo "<td>".$row['wind']."</td><td>".$row['windDir']."</td></tr>";
	}
	echo "</table></div>";
}
else{
  throw new Exception("<p>Something went wrong</p>");
}

/*Creating a JSON file and saving to static folder
If run by using <include> the whole page crashes
and return a single JSON file with jibberish(HTML code) on it.
*/
$newQuery="SELECT * FROM $dbTable WHERE date='".$heute."';";
$json=[];
$classy="";
$myColor="";
if($res = mysqli_query($conn,$newQuery)){
  foreach ($res as $dat){
    if ($dat['hour'] < $heure) {
      $classy="bar-old";
      $myColor="#98A2A9";
    } else {
      $classy="bar-new";
      $myColor="#cc274c";
    }
    $dat['color']=$myColor;
    /*var_dump($dat);*/
    $json[] = $dat;
  }
}
$json = json_encode($json);
file_put_contents("data/all_weather.json",$json);

mysqli_close($conn);
?>
<!--?php include 'static/get_json_db.php'?-->
<script src = "static/accordion_table.js"></script>
<script src="static/plt_weather_json.js"></script>
<!--script src="static/get_json.js"></script-->
</body>
<footer>
<div class="row" style="padding:0px;">
<div class="column">
<p>Data from <em>tenki.jp</em> scraped using <i>Shell, curl and SED</i>.</p>
</div>
<!--div class="column">empty div</div-->
<div class="column" style="text-align:right;">
<p>Hello from
  <a target="blank" href="https://www.openstreetmap.org/search?query=35.17271%2C136.89547#map=18/35.17271/136.89547">
    N35 10'53" E136 54'23"</a></p>
</div></div>
<p style="text-align:center;"><span class="copy-left">&copy;</span><span> Copyleft 2022-07-29</span></p>
</footer>
</html>
