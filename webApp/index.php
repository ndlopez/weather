<!DOCTYPE html>
<html>
  <head>
    <script src="clock.js"></script>
  </head>

  <body>
  <h2>Weather data from tenki.jp</h2>

  <canvas id="clock"></canvas>

  <?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDB";

$heute=date("Y-m-d")
$heure=date("h")
echo "today is " . date("Y-m-d") . "<br>";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, firstname, lastname FROM MyGuests";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "id: " . $row["id"]. " - Name: " . $row["firstname"]. " " . $row["lastname"]. "<br>";
  }
} else {
  echo "0 results";
}
$conn->close();
?>
</body>
</html>
