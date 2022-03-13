const obj = { "limit":10 };
const dbParam = JSON.stringify(obj);
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function() {
  myObj = JSON.parse(this.responseText);
  let text = ""
  for (let x in myObj) {
    text += myObj[x].temp + "<br>";
  }
  document.getElementById("demo").innerHTML = text;
};
xmlhttp.open("GET", "get_json_db.php?x=" + dbParam);
xmlhttp.send();
