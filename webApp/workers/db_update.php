<?php
ini_set('display_errors',1);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Update Database</title>
<meta charset="utf-8"/>
<!--meta http-equiv="refresh" content="3600"-->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="../static/estilo.css">
<script src="../static/digi_clock.js"></script>
</head>

<body>
<?php
date_default_timezone_set("Asia/Tokyo");/*$heure = $heure + 8;*//*Japan*/
$heute = date("Y-m-d");
$heure = date("H");
$myMsg = "Good Morning";
?>  
  <header class="sticky row">
    <div class="half"><p>
      <?php
      if ($heure > 12){
        $myMsg="Good Afternoon";
      }
      echo $myMsg;
      ?></p>
    </div>
    <div class="counter"><h2 id="currtime"></h2></div>
  </header>

  <div class="header"><h2>Today's weather</h2><h3>Nagoyashi, Naka-ku</h3></div>

  <nav>
     <ul>
        <li><a target="blank" href="/phpmyadmin">Home</a></li>
        <li><a href="/dashboard">WSL Server</a></li>
        <li><a target="blank" href="https://github.com/ndlopez/weather_app">
          WebMaster</a></li>
        <li><a href="https://ndlopez.github.io/jumble_game">Play Jumble</a></li>
     </ul>
  </nav>

<div class="clearfix">
<?php
$dbTable = weather_data;
include_once('../config/myconfig.php');

if(isset($_POST['add'])){
    if(mysqli_connect_errno()){
        die("Could not connect: ". mysqli_connect_error());
    }
    else{echo "<p>Connection to Database... OK</p>";}
    if(! get_magic_quotes_gpc()){
        $temp_data = addslashes($_POST['weather']);
        $windDir = addslashes($_POST['windDir']);
    }

    $tag = $_POST['date'];
    $hora = $_POST['hour']
    $tempC = $_POST['temp'];
    $rainProb = $_POST['rainProb'];
    $mmRain = $_POST['mmRain'];
    $humid = $_POST['humid'];
    $wind = $_POST['humid'];
    $windDir = $_POST['windDir'];

    $query = "INSERT INTO $dbTable ".
    "(tag, hora, temp_data, tempC, ".
    "rainProb, mmRain, humid, wind,windDir) ".
    "VALUES('$tag','$hora','$tempC','$rainProb','$mmRain','$humid','$wind','$windDir');";
    //"VALUES('2022-08-29','0','晴れ','23','0','0','68',1,'北北西');";
    //mysqli_select_db($conn,'weather_data'); already sel on config
    $retval = mysqli_query($conn,$query);

    if (!$retval){die('Couldnt enter data:'.mysqli_error($conn));}
    printf("Success: data entered\n");
    mysqli_close();
}else{
?>
<form method = "post" action = "<?php $_PHP_SELF ?>">
<table>
    <tr><td>Date</td>
    <td><input name="today" type="text" id="today"></td></tr>
    <tr><td>Hour</td>
    <td><input name="hora" type="text" id="hora"></td></tr>
    <tr><td>Weather</td>
    <td><input name="temp_data" type="text" id="temp_data"></td></tr>
    <tr><td>Temperature</td>
    <td><input name="tempC" type="text" id="tempC"></td></tr>
    <tr><td>Rain Prob[%]</td>
    <td><input name="rainProb" type="text" id="rainProb"></td></tr>
    <tr><td>Rain [mm]</td>
    <td><input name="mmRain" type="text" id="mmRain"></td></tr>
    <tr><td>Humidity</td>
    <td><input name="humid" type="text" id="humid"></td></tr>
    <tr><td>Wind Speed[m/s]</td>
    <td><input name="wind" type="text" id="wind"></td></tr>
    <tr><td>Wind Direction</td>
    <td><input name="windDir" type="text" id="windDir"></td></tr>
    <tr><td><input name="add" type="submit" id="add" value="Add data"></td></tr>
</table>
</form>
<?php } ?>
</div>
</body>
</html>