/*
digital clock from
https://codepen.io/dudleystorey/pen/xxeEvd
*/
//var currentTime = document.getElementById("currtime");
var currentTime="";
function zeropadder(n) {
  return (parseInt(n,10) < 10 ? '0' : '')+n;
}
setInterval(function(){
  var timeNow= new Date();
  let hh = timeNow.getHours();
  let mm = timeNow.getMinutes();
  let ss = timeNow.getSeconds();
  //formatAMPM = (hh >= 12?'PM':'AM');
  //hh = hh % 12 || 12;
  currentTime = hh + ":" + zeropadder(mm) + ":" + zeropadder(ss);// + " " + formatAMPM;
  //console.log(currentTime)
  document.getElementById("currtime").innerHTML = currentTime;
  //setTimeout(updateTime,1000);
},1000);

