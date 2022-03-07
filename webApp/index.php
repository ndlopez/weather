<!DOCTYPE html>
<html>
<body>
<h2>Weather data from tenki.jp</h2>
<?php

$dbhost = "localhost:3306";
$dbuser = "kathy";
$dbpass = "***";

$conn = mysql_connect($dbhost,$dbuser,$dbpass);
if(! $conn){
	die("Could not connect: ". mysql_error());
}

//$sql = "DELETE FROM tenki WHERE date IS NULL";
$sql = "SELECT * FROM tenki WHERE date = '2022-03-07' AND hour = 16";
mysql_select_db('weather');
$retval = mysql_query($sql,$conn);

if(! $retval){
	die("Could not GET data: " . mysql_error());
}

echo "<p>Displaying data successfully<\p>\n";
mysql_close($conn);
?>
</body>
</html>
