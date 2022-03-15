<!DOCTYPE html>
<html lang="en">
<head>
<title>Today's weather</title>
<meta charset="utf-8"/>
<meta http-equiv="refresh" content="3600">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="static/estilo2.css">
<script src="libs/d3.v4.js"></script>
<script src="static/digi_clock.js"></script>
</head>

<body>
<!--h2>本日の天気情報</h2>
<h4>tenki.jpのﾃﾞｰﾀの見出し一覧を取って来た</h4-->

<div class="header">
<h2>Today's weather</h2><h3>Nagoyashi, Naka-ku</h3>

</div>

<nav>
   <ul>
      <li><a href="/phpmyadmin">My PHP Admin</a></li>
      <li><a href="/dashboard">XAMPP Server</a></li>
      <li><a href="https://github.com/ndlopez">WebMaster</a></li>
      <li><a href="https://tenki.jp/forecast/5/26/5110/23106/1hour.html">Data Source</a></li>
   </ul>
</nav>

<div class="clearfix">
<?php

date_default_timezone_set("Asia/Tokyo");
$heute = date("Y-m-d");
$heure = date("H");
/*$heure = $heure + 8;*//*Japan*/

$dbhost = "127.0.0.1:3306";
$dbname = "weather";
$dbuser = "root";
$dbpass = "";
//when coding on the server side, should use root not kathy;

$conn = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);
if(mysqli_connect_errno()){
	die("Could not connect: ". mysqli_connect_error());
}
else{
echo "<p>Connection to Database... OK</p>";
}

//$query = "DELETE FROM tenki WHERE date IS NULL;";
$query = "SELECT * FROM tenki WHERE date = '" . $heute . "' AND hour = " . $heure .";";
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
		echo "<h1>".$row['weather'].$row['temp']."C</h1>";
	}
	//echo "<p>Rain chance [%]</th><th>Humidity</th><th>Wind [m/s]";
	foreach ($result as $row){
		//var_dump($row);
		echo "<h4>Rain Chance ".$row['rainProb']."% <br>Humidity ".$row['humid'] ."%<br>";
		echo "Wind ".$row['wind']."m/s".$row['windDir']."</h4>";
	}
}
else{
	echo "<p>Something went wrong :( </p>";
}
?>
<!--/div--><!-- bottom-left class: Text above img -->
<!--/div--><!-- container class-->
</div><!-- Column container -->
<div class="column" style="text-align:center;">
<img alt="Radar image of Aichi Pref." src="https://static.tenki.jp/static-images/radar/recent/pref-26-middle.jpg"/>
</div>
<div id="weather_bar" class="column"></div>
</div><!--Today weather report row-->

<button class="accordion" style="background-color:#2e4054;color:#bed2e0;">Later today</button>
<div class="panel" style="padding:0px;">
<table id="myday">
<?php
//Display next hour conditions
echo "";
$heure = $heure +1;
$query2 = "SELECT * FROM tenki WHERE date = '".$heute."' AND hour BETWEEN ".$heure." AND 24;";

if ($result = mysqli_query($conn,$query2)){
	/*foreach ($result as $row){
		echo "<h3>".$row['hour'].":00 ".$row['weather'].$row['temp']."C</h3>";
	}*/
	echo "<tr><th>Time</th><th>Weather</th><th>Temperature<br>[C]</th><th>Rain chance<br>[%]</th><th>Humidity<br>[%]</th><th>Wind Speed<br>m/s</th><th>Direction</th></tr>";
	
	foreach ($result as $row){
		//var_dump($row);
		echo "<tr><td>".$row['hour'].":00</td><td>".$row['weather']."</td><td>".$row['temp']."</td>";
		echo "<td>".$row['rainProb']."</td><td>".$row['humid'] ."</td>";
		echo "<td>".$row['wind']."</td><td>".$row['windDir']."</td></tr>";
	}
	echo "</table></div>";
}
else{
	echo "<p>Something went wrong</p>";
}
mysqli_close($conn);
?>
<!--?php include 'static/get_json_db.php'?-->
<div id="demo"></div>

<script>
var acc=document.getElementsByClassName("accordion");
for(var i=0;i<acc.length;i++){
   acc[i].addEventListener("click",function(){
   this.classList.toggle("active");
   var panel=this.nextElementSibling;
   if(panel.style.display==="block"){
        panel.style.display="none";
   }else{
	panel.style.display="block";
   }
   });
}
</script>
<script src="static/plt_weather.js"></script>
<!--script src="static/get_json.js"></script-->
</body>
<footer>
<!--p>Hello from 北緯35度10分53秒 東経136度54分23秒<br-->
<div class="row" style="padding:0px;">
<div class="column">
<p>Data from <em>tenki.jp</em> scraped using <i>Shell, curl and SED</i>.</p>
</div>
<div class="column"></div>
<div class="column" style="text-align:right;">
<p>Hello from <a target="blank" href="https://www.openstreetmap.org/search?query=35.17271%2C136.89547#map=18/35.17271/136.89547">N35 10'53" E136 54'23"</a></p>
</div></div>
<p style="text-align:center;"><span class="copy-left">&copy;</span><span>2022-03-10</span></p>

</footer>
</html>