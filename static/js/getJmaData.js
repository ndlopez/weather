//import { theseMonths } from "./build_data.js"; SyntaxError!
// 120x120 px Moon, courtesy of timeanddate.com
/* append png image to svg Object
    <svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink">

    ...
    <image
        width="100" height="100"
        xlink:href="data:image/png;base64,IMAGE_DATA"
        />
    ...
    </svg>
*/

const svg_org = "http://www.w3.org/2000/svg";
const not_curr_Moon = "https://www.timeanddate.com/scripts/moon.php?i=0.809&p=5.670&r=5.592";
// console.log(getBase64Img(document.getElementById("pngImg")));
/* Fetching data from JMA.go.jp */
const toRad = Math.PI/180.0;
const jmaURL = "https://www.jma.go.jp/bosai/forecast/data/forecast/";
const city_code = [{name:"Nagoya",code:230000},{name:"Takayama",code:210000}];
// var city_idx = 0; // 0:Nagoya, 1:Takayama
/* data per hour for current day here:
 https://www.jma.go.jp/bosai/amedas/data/point/51106/20221007_09.json
 format seems to be yyyymmdd_hh.json, hh< currHour, hh=0,3,6,9,...
 also https://www.jma.go.jp/bosai/amedas/#area_type=offices&area_code=230000&amdno=51106&format=table1h&elems=53414
 might be helpful when rain https://codepen.io/aureliendotpro/pen/kVwyVe*/
const ico_url = "https://www.jma.go.jp/bosai/forecast/img/";
const radar_url = ["https://static.tenki.jp/static-images/radar/recent/pref-26-",
"https://www.jma.go.jp/bosai/nowc/m_index.html#zoom:11/lat:35.211116/lon:136.901665/colordepth:normal/elements:hrpns&slmcs"];
const sun_time = ["https://dayspedia.com/api/widget/city/11369/?lang=en",
"https://dayspedia.com/api/widget/city/4311/?lang=en"];

const hh = [6,12,18,23];

const theseMonths = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];
// const theseDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const theseDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

let my_date = new Date();
const thisHour = my_date.getHours(), thisMins = my_date.getMinutes();

function zero_pad(tit){return (tit<10)?"0"+tit:tit;}

async function sleepy(msec){
    return new Promise(resolve =>setTimeout(resolve,msec));
}

// console.log(window.screen.width,window.screen.height);
disp_info(0);

function getDateHour(isoStr){
    // isoStr: ISO format
    const gotDate = new Date(isoStr);
    return {"monty":gotDate.getMonth() + 1,"tag":gotDate.getDate(),"day":gotDate.getDay(),"heure":gotDate.getHours()};
}

function calc_obj_pos(setRiseArr){
    // setRiseArr = [riseHr,riseMin,setHr,setMin]
    console.log("thisTimes:",setRiseArr);
    var offset = [thisHour - setRiseArr[0], setRiseArr[2] - setRiseArr[0]];
    if(setRiseArr[0] > setRiseArr[2]){
        offset[1] = 24-setRiseArr[0]+setRiseArr[2];
    }
    if(thisHour < setRiseArr[0]){
        offset[0] = 24 - setRiseArr[0] + thisHour;
    }
    const x0 = offset[0]*60 + (thisMins - setRiseArr[1]);
    const rr = offset[1]*60 + (setRiseArr[3] - setRiseArr[1]);//diameter
    const phi = Math.acos(1 - (2*x0/rr));
    const y0 = Math.sin(phi);
    return [rr,x0,y0];
}

function build_obj_pos(sunSetRise,moonSetRise) {
    /* moonSetRise=[date,hhR,mmR,hhS,mmS] date might not be needed*/
    const sun_times = [sunSetRise.sunrise[0],sunSetRise.sunrise[1],sunSetRise.sunset[0],sunSetRise.sunset[1]];
    const moon_times = [parseInt(moonSetRise[2][0].trim()),parseInt(moonSetRise[2][1]),
    parseInt(moonSetRise[1][0].trim()),parseInt(moonSetRise[1][1])];
    // const width = window.screen.width -20, height = Math.floor(220*width/360) ;//px, 300x180, 120 for summer
    const width = 350, height = 220;

    const sun_pos = calc_obj_pos(sun_times);//[0]:rr,[1]:x0, [2]:y0
    const moon_pos = calc_obj_pos(moon_times);
    var posX0Y0 = [0,0],moon_x0y0 = [0,0];
    
    //console.log("Moon",calc_obj_pos(moon_times),"Sun",calc_obj_pos(sun_times));
    const subDiv = document.createElement("div");
    subDiv.setAttribute("class","clearfix");
    subDiv.setAttribute("id","sun-pos");

    const svgGroup = document.createElementNS(svg_org, 'svg');
    svgGroup.setAttribute("width",width);
    svgGroup.setAttribute("height",height);
    
    var offset = 20;
    if((sun_pos[1] <= sun_pos[0]) && (sun_pos[1] > 0)){
        //const theta = Math.acos(1 - (2*sun_pos[1]/sun_pos[0]));//radians
        posX0Y0 = [sun_pos[1]*width/sun_pos[0] - offset,height-0.5*width*sun_pos[2]];//px
        //console.log("thisPos", sun_times, sun_pos[0],sun_pos[1],0.5*width*sun_pos[2],posX0Y0);
    }
    
    if((moon_pos[1] <= moon_pos[0]) && (moon_pos[1] > 0)){
        moon_x0y0 = [moon_pos[1]*width/moon_pos[0],height-0.5*width*moon_pos[2]];
    }
    //console.log("_Moon",moon_pos,moon_x0y0);

    const svgCircle = document.createElementNS(svg_org,'circle');
    svgCircle.setAttribute("stroke","#2e4054");
    svgCircle.setAttribute("stroke-width","2");
    svgCircle.setAttribute("fill","transparent");//
    svgCircle.setAttribute("stroke-dasharray","2,10");//5,5; 10,10; 5,10; 20,10,5,5,5,10
    svgCircle.setAttribute("r",0.5*width-26);
    svgCircle.setAttribute("cx",0.5*width);
    svgCircle.setAttribute("cy",0.5*width);

    offset = 5; 
    if(thisHour < 12){offset = -5;}
    /*const svgSun = document.createElementNS(svg_org,'circle');
    svgSun.setAttribute("fill","#E8B720");svgSun.setAttribute("r",5);
    svgSun.setAttribute("cx",posX0Y0[0]-offset);svgSun.setAttribute("cy",posX0Y0[1]);*/
    
    const svgSun = document.createElementNS(svg_org,'text');
    svgSun.setAttribute("fill","#E8B720");
    svgSun.setAttribute("x",posX0Y0[0] - offset);
    svgSun.setAttribute("y",posX0Y0[1]);
    svgSun.setAttribute("font-size","36px");
    svgSun.textContent = "\u2600";//String.fromCodePoint(0x1F506);
    
    const svgMoon = document.createElementNS(svg_org,'text');
    svgMoon.setAttribute("x",moon_x0y0[0] + offset);//width/24*thisHour
    svgMoon.setAttribute("y",moon_x0y0[1]);//0.1*height
    svgMoon.setAttribute("font-size","24px");
    svgMoon.textContent = String.fromCodePoint(0x1F314);
    //for some reason not parsed :(
    /*const svgSubG = document.createElementNS(svg_org,'g');
    svgSubG.setAttribute("font-size","30");svgSubG.setAttribute("fill","#ececec");
    svgSubG.textContent = '<text x="'+(0.1*width)+'" y="'+(0.25*width)+'">\u2601</text>'+
    '<text x="10" y="40">\u2601</text>';*/
    offset = (width-20)/24*thisHour;
    const svgFlying = document.createElementNS(svg_org,'text');
    svgFlying.setAttribute("x",(width - offset));
    svgFlying.setAttribute("y",0.3*height);
    svgFlying.setAttribute("font-size","24px");
    svgFlying.textContent = String.fromCodePoint(0x1F681);//"\u2601"; //cloud
    // String.fromCodePoint(0x1F681); helicopter, 1F699, jeep
    const svgRunner = document.createElementNS(svg_org,'text');
    svgRunner.setAttribute("x",0.8*width);
    svgRunner.setAttribute("y",height-2);
    svgRunner.setAttribute("font-size","20px");
    svgRunner.textContent = String.fromCodePoint(0x1F6B4);
    // Sun Rise/Set times on svg bkg
    const svgRise = document.createElementNS(svg_org,'text');
    svgRise.setAttribute("fill","#cc274c");
    svgRise.setAttribute("x",18);
    svgRise.setAttribute("y",0.5*width + 35);//+28
    svgRise.setAttribute("font-size","18px");
    svgRise.textContent = sun_times[0] + ":" + sun_times[1];
    const svgSet = document.createElementNS(svg_org,'text');
    svgSet.setAttribute("fill","#fff");
    svgSet.setAttribute("x",width - 48);
    svgSet.setAttribute("y",0.5*width + 35);//28
    svgSet.setAttribute("font-size","18px");
    svgSet.textContent = sun_times[2] + ":" + sun_times[3];
    // Clock on tower of svg bkg
    const svgHour = document.createElementNS(svg_org,'text');
    svgHour.setAttribute("fill","#fff");svgHour.setAttribute("font-size","13px");
    svgHour.setAttribute("x",0.77*width);svgHour.setAttribute("y",0.51*height);
    svgHour.textContent = thisHour + ":" + zero_pad(thisMins);

    svgGroup.appendChild(svgFlying);
    
    if(sun_pos[1] < sun_pos[0]){
        svgGroup.appendChild(svgCircle);
        svgGroup.appendChild(svgRise);
        svgGroup.appendChild(svgSet);
        svgGroup.appendChild(svgSun);
        //if not(thisHour > sun_times[2]) || (thisHour < sun_times[0])
    }else{
        console.log(thisHour,thisMins,"Sun below horizon");
        svgGroup.appendChild(svgRunner);
    }
    if(moon_pos[1] < moon_pos[0]){
        //(thisHour <= moon_times[2]) || (thisHour >= moon_times[0])
        svgGroup.appendChild(svgMoon);
    }else{
        console.log(thisHour,thisMins,"Moon below horizon");
    }
    svgGroup.appendChild(svgHour);
    subDiv.appendChild(svgGroup);
    return subDiv;
}

async function disp_info(kat){
    await sleepy(1500);
    const gotData = await get_data(kat);
    // console.log(gotData.temp);
    var myMin = gotData.temp[1][2];
    var myMax = gotData.temp[1][3];
    if(myMax === undefined){
        myMax = gotData.temp[1][1];
        myMin = gotData.temp[1][0];
    }
    var texty = "";
    const city_name = document.getElementById("this_place");
    if (city_name !== null){
        document.title = gotData.location + ": " + gotData.weather[0];
        city_name.innerHTML = "<br>" + gotData.location;
    }
    const gotTime = await getTimes();//fetch Sun rise/set
    const moonTimes = await getMoonTimes();//fetch Moon rise/set
    console.log("Moon",moonTimes);
    //sunrise/sunset + wind info
    const weathernfo = document.getElementById("curr_weather");
    weathernfo.appendChild(build_obj_pos(gotTime,moonTimes));
    
    /*var jennaDiv = document.createElement("div");
    jennaDiv.setAttribute("class","clearfix");
    jennaDiv.style.background = "url(../assets/daylen.svg) no-repeat";
    jennaDiv.style.backgroundPosition = "50% 0%";
    jennaDiv.setAttribute("id","sunRiseSet");
    texty = "<div class='column3 float-left'><img src='../assets/sunrise.svg' width=32/><p class='no-margin'>"+gotTime.sunrise[0]+":"+gotTime.sunrise[1]+
    "</p></div>" + "<div class='column3 float-left'><h3>"+ gotData.wind[0] +
    "</h3></div><div class='column3 float-left'><img src='../assets/sunset.svg' width=32/><p class='no-margin'>" + 
    gotTime.sunset[0]+":"+gotTime.sunset[1] + "</p></div>";
    jennaDiv.innerHTML = texty;
    weathernfo.appendChild(jennaDiv);*/
    
    const nowTenki = document.getElementById("now_weather");
    if(nowTenki !== null){
        var kaisa="";
        if((thisHour > parseInt(gotTime.sunset[0])) || (thisHour < parseInt(gotTime.sunrise[0]))){
            kaisa = "<img src='static/assets/cloudy_night.svg'/><br/>";
            weathernfo.style.backgroundColor = "#0B1026";
            weathernfo.style.backgroundImage = "url('static/assets/clear_night.svg')";
        }else{
            weathernfo.style.backgroundColor = "#87ceeb";
            weathernfo.style.color = "#2e4054";
            weathernfo.style.backgroundImage = "url('static/assets/clear_day.svg')";
            kaisa = "<img src='" + ico_url + gotData.icon[0] +
            ".svg' onerror='this.onerror=null;this.src=\"static/assets/cloudy_all.svg\"'/><br/>";
        }
        nowTenki.innerHTML = kaisa + gotData.weather[0] + "<br/>" + gotData.wind[0];
    }
    /* today rain Prob*/
    const rainP = document.getElementById("rainProb");
    if(rainP !== null){
        rainP.innerText = gotData.rain[1][0] + "%";
    }

    const radarImg = document.getElementById("radar_img");
    if(gotData.rain[1][0] > 0){
        // put a radar img from tenki.jp
        let auxVar = ""; 
        if(navigator.userAgent.match(/(iPhone|iPad|Android|IEMobile)/)){
            auxVar = "middle";
        }else{auxVar = "large";}
        radarImg.innerHTML = '<h3>Rain radar</h3><a href="' + 
        radar_url[1] + '" title="Click on the img for 1hour forecast. Redirects to JMA.go.jp" target="_blank"><img src="' + radar_url[0] + auxVar +'.jpg"></a>';
    }
    //when parsing currCond only: var currWeather = gotData.weather[1].split("　");
    /*for(let idx=0;idx<gotData.weather.length;idx++){
        var currWeather = gotData.weather[idx].split("　");
        texty += "<h2>"+gotData.time[idx].slice(0,10)+" "+currWeather[0]+
        "<img src='"+ico_url+gotData.icon[idx]+".svg'/></h2>";}*/
    
    /* Weekly forecast Max/Min*/
    const colDiv = document.getElementById("forecaster");
    var init_idx = 2;
    if(thisHour >= 11){init_idx=1;}
    //create as many group div as forecast are available
    for(let idx = init_idx;idx < gotData.forecast[0].length; idx++){
        const groupDiv = document.createElement("div");
        groupDiv.setAttribute("class","row");

        var aux = getDateHour(gotData.forecast[0][idx]);
        var tempMin = gotData.forecast[2][idx], tempMax = gotData.forecast[3][idx];
        texty = "<div class='column3 float-left' style='margin:0;border-radius:inherit;'><div class='row-date'>" + 
        "<h2 class='col-date float-left'>"+ aux.tag + "</h2><div class='col-date float-left' style='text-align:left;padding-left:0;'><p><strong>"+theseDays[aux.day] + 
        "</strong></p><p><small>"+theseMonths[aux.monty-1]+"</small></p></div></div></div>";
        
        texty += "<div class='column3 float-left'><img src='"+
        ico_url+ gotData.forecast[1][idx]+
        ".svg' onerror='this.onerror=null;this.src=\"static/assets/overcast.svg\"'/>"+
        "<span style='margin-top:'>"+
        gotData.forecast[4][idx]+"%</span></div>";

        /*if(idx==0){ tempMin = myMin;tempMax = myMax; }*/
        texty += "<div class='column3 float-left'><h4>"+tempMin+"&#8451; | "+tempMax+"&#8451;</h4></div>";
        if((idx == 1) && (gotData.wind[2] != undefined)){
            texty += "<p style='text-align:center;font-size:small;'>"+gotData.weather[2]+"、"+gotData.wind[2]+"</p>";            
        }
        groupDiv.innerHTML = texty;
        colDiv.appendChild(groupDiv);
    }

    /* 2moro forecast + rain Prob */
    const myDiv = document.getElementById("foreDiv");
    const headTitle = document.createElement("h2");
    init_idx = 1;//Before 11AM 0:today, 1: tomorrow
    if(thisHour >= 11){init_idx = 0;}     
    var sofy = getDateHour(gotData.forecast[0][init_idx]);
    headTitle.innerText = "Tomorrow: " + theseDays[sofy.day] + ", " + theseMonths[sofy.monty-1] +
    " " + sofy.tag;
    myDiv.appendChild(headTitle);

    const iconElm = document.createElement("div");
    iconElm.setAttribute("class","column float-left");
    texty = "<br/><p>"+gotData.weather[1] +"</p><p>"+gotData.wind[1]+"</p>";
    
    texty += "<span>Min "+ myMin +"&#8451; | Max "+ myMax+"&#8451;</span>";
    iconElm.innerHTML = "<img src='"+ico_url+gotData.icon[1]+
    ".svg' onerror='this.onerror=null;this.src=\"static/assets/cloudy_all.svg\"'/>"+
    texty;
    
    const tempElm = document.createElement("div");//tomorrow temp
    tempElm.setAttribute("class","column float-left");
    texty = "";
    let jdx = gotData.rain[0].length-1;
    let kdx = 0;
    var textW = "<p>降水確率</p><div class='row'>";
    for(let idx = jdx-3;idx < jdx+1;idx++){
        const get_date = getDateHour(gotData.rain[0][idx]);
        texty += "<p class='col4'>"+get_date.heure+" - "+hh[kdx]+"<br/>"+gotData.rain[1][idx]+"%</p>";
	    kdx++;
    }
    texty += "</div>";
    tempElm.innerHTML = textW + texty;
    myDiv.appendChild(iconElm);
    myDiv.appendChild(tempElm);
}

async function get_data(jdx){
    var my_url = jmaURL + city_code[jdx].code + ".json";
    const response = await fetch(my_url);
    const data = await response.json();
    //0: currDay, 1: nextDay, 2:dayAfter2moro
    const place = data[1].timeSeries[1].areas[jdx].area.name;
    var upTime = data[0].timeSeries[0].timeDefines;
    var thisWeather = data[0].timeSeries[0].areas[jdx].weathers;
    var weatherIcon = data[0].timeSeries[0].areas[jdx].weatherCodes;
    var winds = data[0].timeSeries[0].areas[jdx].winds;
    var rainTimes = data[0].timeSeries[1].timeDefines;//6:every 6hrs
    var rainProb = data[0].timeSeries[1].areas[jdx].pops;//6 data
    var tempTimes = data[0].timeSeries[2].timeDefines;//max/min only
    var temp = data[0].timeSeries[2].areas[jdx].temps;//currDay:0,1; nextDay:2,3
    //weekly forecast
    var weekDates = data[1].timeSeries[0].timeDefines;// 7dates
    var weekIcons = data[1].timeSeries[0].areas[jdx].weatherCodes; // 7 code Icons
    //var weekTempDates = data[1].timeSeries[1].timeDefines; //7dates
    var weekTempMin = data[1].timeSeries[1].areas[jdx].tempsMin;
    var weekTempMax = data[1].timeSeries[1].areas[jdx].tempsMax;
    var weekRainProb = data[1].timeSeries[0].areas[jdx].pops;
    //console.log("RainProb",weekRainProb);
    return {"location":place,"time":upTime,"weather":thisWeather,"icon":weatherIcon,
    "wind":winds,"rain":[rainTimes,rainProb],"temp":[tempTimes,temp],
    "forecast":[weekDates,weekIcons,weekTempMin,weekTempMax,weekRainProb]};
}

function convTime(unixT){
    const myTime = new Date(unixT *1000);
    var minut = myTime.getMinutes();
    if(minut < 10){
        minut = "0" + minut;
    }
    return [myTime.getHours(), minut];
}

async function getTimes(){
    const response = await fetch(sun_time[1]);
    const data = await response.json();
    let sunRise = data["sunrise"];
    let sunSet = data["sunset"];
    
    return {"sunrise":convTime(sunRise),"sunset":convTime(sunSet)}; 
}

async function getMoonTimes(){
    const response = await fetch("https://raw.githubusercontent.com/ndlopez/ndlopez.github.io/main/data/moon_setrise.csv");
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const thisDay = my_date.getFullYear() + "-" + zero_pad(my_date.getMonth()+1) + 
    "-" + zero_pad(my_date.getDate()); //Current date
    var thisData = [];
    rows.forEach(row => {
        const thisVal = row.split(","); // [2022-12-05, 08:32, 21:20]
        
        if(thisDay == thisVal[0]){
            // console.log(thisDay,thisVal);
            thisData.push(thisVal[0]);
            thisData.push(thisVal[1].split(":"));
            thisData.push(thisVal[2].split(":"))
        }
    });
    if (thisData.length == 0){
        // Just in case moon_data is not updated
        thisData = ["2023-04-01",["03","20"],["13","27"]];
    }
    return thisData;
}

function getBase64Img(img){
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0);
    let dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
/*
    const svgLine = document.createElementNS(svg_org,'rect');
    svgLine.setAttribute("x",0);//26
    svgLine.setAttribute("y",0.5*width);
    svgLine.setAttribute("stroke","#50653b");//059862 smbc color
    svgLine.setAttribute("fill","#50653b");//green
    svgLine.setAttribute("width",width);// -2*26
    svgLine.setAttribute("height",30);
    //svgLine.setAttribute("x2",width);svgLine.setAttribute("y2",0.5*width);
    //var myPath = "M240 100 A40 40 40 10 90 100 0"; semicirc
    //var myPath = "M3.034,56C18.629,24.513,52.554,2.687,91.9,2.687S165.172,24.513,180.766,56h3.033 
    C168.016,23.041,132.807,0.098,91.9,0.098C50.995,0.098,15.785,23.041,0.002,56H3.034z";
    const svgPath = document.createElementNS(svg_org,'path');
    svgPath.setAttribute("id","road");
    svgPath.setAttribute("stroke","#2e4054");
    svgPath.setAttribute("stroke-width","2");
    svgPath.setAttribute("fill","#2e4054");//#E8B720
    var myPath = "M100 180 L130 150 170 150 200 180Z";
    svgPath.setAttribute("d",myPath);

    async function getIconCodes(){
    const resp = await fetch("../data/w_codes.json");
    const data = await resp.json();return data;
}*/
