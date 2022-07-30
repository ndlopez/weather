//!/usr/bin/osascript -l JavaScript
/*
    # Similar to the app to display weather on the CLI
    # This app displays local weather 
    # at the Notification center in MacOS
    # obviously requires data 
    # fetched and cleaned using curl and sed
*/
var app = Application.currentApplication()

app.includeStandardAdditions = true

let dataHome = "data/grep_tenki.mod.csv"
let nowTime= app.currentDate() //current date and time
var nowHeure = nowTime.getHours();
var nowMinute = nowTime.getMinutes();
var currentTime = nowHeure + ":";
currentTime+= (nowMinute < 10)? ("0"+ nowMinute):(nowMinute);

function readDataFile(fileName){
	try{
		var pathStr = fileName.toString()
		return app.read(Path(pathStr))
	}
    catch(error){
		displayError(fileName + " NO such data on system.", ["Cancel", "Exit"])
	}
}

function displayError(errorMessage, buttons) {
    app.displayDialog(errorMessage, {
        buttons: buttons
    })
}

var myData=readDataFile(dataHome);

function txtToArray(){
	//#Convert csv table to array
	var timeTable = [];
	var myData = readDataFile(dataHome);
	var lineBreak = myData.split("\n");
	lineBreak.forEach(res => {
		timeTable.push(res.split(","));
	});
	return timeTable
}

function getWeather(outHeure){
	var temp=txtToArray();
	for (var idx=1;idx<temp.length;idx++){
		var aux=temp[idx].toString();
		var dataArray=aux.split(",");
		var heure = temp[idx].slice(0,1);
		if( heure == outHeure){
			return dataArray
		}
	}
}

function getMsg(hora){
	var myData = getWeather(hora);
	if (typeof myData === "undefined"){
		return "Consult with tenki.jp :("
	}
	var Msg = myData[0]+":00 ";
	var weatherStr = String.fromCharCode(myData[2]) + " Rain";
	var windyStr = String.fromCharCode(myData[9]) + " "; //arrow \u2198, cloudy \u26c8,\u96F2\u308a
	var myStr = ["°C "+weatherStr,"% ","mm 湿度","%  "+windyStr,"m/s"];
	for(item = 3;item < myData.length-2; item++){
		Msg += myData[item];
		Msg += myStr[item-3];
	}
	return Msg;
}
var currData=getWeather(nowHeure);

app.displayNotification(getMsg(nowHeure+2),{//\u3041
	withTitle: "Weather in Kobe, Now " + currentTime + " " + currData[3] + "°C "+ String.fromCharCode(currData[2]),
	subtitle: getMsg(nowHeure+1),
	soundName: "Frog"
})
