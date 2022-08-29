<?php
$dbpass="gWloF1Uk";
$config = parse_ini_file('data/weather.ini');
$conn = mysqli_connect($config['dbhost'], $config['dbuser'], $dbpass);
mysqli_select_db($conn, $config['dbname']);
