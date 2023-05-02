/*
Fetch data from jma website and organize it to display and plot.
New feature to be added later:
Up to a certain date all earthquakes in Japan
 https://www.jma.go.jp/bosai/quake/data/list.json
Latest observation
 https://www.jma.go.jp/bosai/ltpgm/data/list.json
From the above url fetch json field and request data to the following path
 https://www.jma.go.jp/bosai/quake/data/ + jsonFileName
 jsonFileName = 20230325071721_20230325071439_VXSE5k_1.json
 */
// CORS problem import {buildProgressCircle, buildGaugeMeter } from "https://raw.githubusercontent.com/ndlopez/webApp/main/static/build_svg.js";
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
/* Fetch observation data from jma site and plot */
const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/";//51106/2022
const pm25_url = "https://www.data.jma.go.jp/gmd/env/kosa/fcst/img/surf/jp/";
const cities = [{name:"Nagoya",code:51106},{name:"Takayama",code:52146}];
const cdx = 0; // 0:Nagoya, 1:Takayama
/*current date and time*/
let myDate = new Date();
const jahre = myDate.getFullYear();
const monty = myDate.getMonth() + 1;
const today = myDate.getDay();
let tag = myDate.getDate();

let currHH = myDate.getHours();
let currMin = myDate.getMinutes();
currHH = currMin > 21? currHH+1:currHH;

let result = []; //store per hour weather data
let curr_weather = []; //store last entry of JSON weather data
let maxmin = []; // Max/Min temp from obs data
let dataHours = [];
let mod3_hours = [];
const toRadians = Math.PI/180.0;
const maxValue = 6; //m/s when 10m/s too many scales, should display half
// Autumn: const ngo_pred = [{xp:0,yp:10.0},{xp:7,yp:8.0},{xp:14,yp:15.5},{xp:23,yp:9.0}];
const ngo_pred = [{xp:0,yp:14.0},{xp:7,yp:11.0},{xp:14,yp:20.0},{xp:23,yp:12.0}];//spring
const tky_pred = [{xp:0,yp:5.0},{xp:7,yp:3},{xp:14,yp:13},{xp:23,yp:4}];
var hours = [];
for (let idx = 0; idx < 24; idx++) hours.push(idx);

/* Fixing bug at 0:00 ~ 0:20 */
/*if (currHH == 0 && currMin < 20){tag = tag - 1;}*/
/* build array of every 3 hours: 0 ~ hh */
for (let idx=0;idx < currHH;idx++){
    if(idx % 3 == 0){ dataHours.push(idx); }
}
for (let idx=0;idx < 24;idx++){
    if(idx %3 ==0){ mod3_hours.push(idx); }
}
// console.log("yester-you",tag,dataHours);
function zeroPad(tit){return (tit<10)?"0"+tit:tit;}

/* wind Direction -> JPchar */
const allDirections = {0:"静穏",1:"北北東",2:"北東",3:"東北東",4:"東",5:"東南東",6:"南東",7:"南南東",8:"南",
9:"南南西",10:"南西",11:"西南西",12:"西",13:"西北西",14:"北西",15:"北北西",16:"北"};
function windChar(number){    
    for (let dat in allDirections){
        if(dat == number){
            return allDirections[number];
        }
    }
}
// wind description according to Beaufort scale (up to 6) in m/s
const desc_wind = [{"speed":0.28,"en_desc":"calm","jp_desc":"静穏"},
{"speed":1.38,"en_desc":"Light Air","jp_desc":"至軽風"},{"speed":3.05,"en_desc":"Light Breeze","jp_desc":"軽風"},
{"speed":5.28,"en_desc":"Gentle Breeze","jp_desc":"軟風"},{"speed":7.78,"en_desc":"Moderate Breeze","jp_desc":"和風"},
{"speed":10.56,"en_desc":"Fresh Breeze","jp_desc":"疾風"},{"speed":13.6,"en_desc":"Strong Breeze","jp_desc":"雄風"}];
//more at https://www.i-kahaku.jp/friend/kagaku/0306/kaze/index.html
function get_wind_desc(wspeed){
    // wspeed is float
    var thisWind = "";
    for (let item in desc_wind) {
        if(wspeed <= desc_wind[item].speed){
            thisWind = desc_wind[item].jp_desc;
            break;
        }
    }
    return thisWind;
}

function build_path(jdx){
    //0 < jdx < 8:
    const path = jma_url + cities[cdx].code + "/" + jahre + zeroPad(monty) + zeroPad(tag) + "_"+zeroPad(dataHours[jdx]) + ".json";
    return path;
}
function build_attrib(tit){
    return String(jahre) + zeroPad(monty) + zeroPad(tag) + zeroPad(tit) + "0000";
}
function get_min_attr(tit){
    if((currMin%10) == 0){
        return String(jahre) + zeroPad(monty) + zeroPad(tag) + zeroPad(tit) + zeroPad(currMin) + "00";
    }
}

function buildProgressCircle(percent,title,texty) {
    let radius = 52;
    const pTitle = document.createElement("p");
    pTitle.innerText = title;
    const subDiv = document.createElement("div");
    subDiv.setAttribute("class","column3 float-left");
    subDiv.appendChild(pTitle);
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    const svgBkgCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    svgGroup.setAttribute("width","120");
    svgGroup.setAttribute("height","120");//180
    svgCircle.setAttribute("class","progress-ring-circle");
    svgCircle.setAttribute("id","frontCircle");
    svgCircle.setAttribute("stroke","#cc274c");
    svgCircle.setAttribute("stroke-width","5");
    svgCircle.setAttribute("stroke-linecap","round");
    svgCircle.setAttribute("fill","transparent");
    svgCircle.setAttribute("r",radius);
    svgCircle.setAttribute("cx","60");
    svgCircle.setAttribute("cy","60");//90
    svgBkgCircle.setAttribute("class","progress-ring-circle");
    svgBkgCircle.setAttribute("stroke","#bed2e0");
    svgBkgCircle.setAttribute("stroke-width","4");
    svgBkgCircle.setAttribute("stroke-dasharray","10,10");
    svgBkgCircle.setAttribute("fill","transparent");
    svgBkgCircle.setAttribute("r",radius);
    svgBkgCircle.setAttribute("cx","60");
    svgBkgCircle.setAttribute("cy","60");//90
    svgGroup.appendChild(svgBkgCircle);
    svgGroup.appendChild(svgCircle);
    
    var circumference = radius * 2 * Math.PI;
    svgCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    svgCircle.style.strokeDashoffset = `${circumference}`;
    const offset = circumference - percent / 100 * circumference;
    svgCircle.style.strokeDashoffset = offset;
    subDiv.appendChild(svgGroup);
    var subDivVal = document.createElement("div");
    subDivVal.setAttribute("class","value");
    subDivVal.innerHTML = texty;
    subDiv.appendChild(subDivVal);

    return subDiv;
}
function buildGaugeMeter(value,title,htmlTxt){
    //Path - Text - Path
    if(value > maxValue){
        // Should re-scale but seems not so easy, probably change maxValue?
        value = 6;
    }
    const radius = 50;
    const pTitle = document.createElement("p");
    pTitle.innerText = title;
    const subDiv = document.createElement("div");
    subDiv.setAttribute("class","column3 float-left");
    subDiv.appendChild(pTitle);
    const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const svgPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    const svgBkgPath = document.createElementNS('http://www.w3.org/2000/svg','path');
    
    svgGroup.setAttribute("width","120");
    svgGroup.setAttribute("height","180");
    svgPath.setAttribute("class","gauge-value");
    svgPath.setAttribute("id","frontCircle");
    svgPath.setAttribute("stroke","#cc274c");
    svgPath.setAttribute("stroke-width","5");
    svgPath.setAttribute("stroke-linecap","round");
    svgPath.setAttribute("fill","none");

    var posXY = buildPath(value,radius,10);
    var myPath = "M 15 90 A 50 50 0 " + posXY[2] + " 1 " + posXY[0] + " "+ posXY[1];
    svgPath.setAttribute("d",myPath);//60 18
    //console.log(value,posXY[0],myPath);//"M 15 90 A 50 50 0 0 1 95.35 32.64"

    svgBkgPath.setAttribute("class","gauge-dial");
    svgBkgPath.setAttribute("stroke","#bed2e0");
    svgBkgPath.setAttribute("stroke-width","4");
    svgBkgPath.setAttribute("stroke-linecap","round");
    //svgBkgPath.setAttribute("stroke-dasharray","10,10");
    svgBkgPath.setAttribute("fill","none");
    svgBkgPath.setAttribute("d","M 15 90 A 50 50 0 1 1 105 90");//105 90
    
    /*Droplet
    M28.344 17.768L18.148 1.09L8.7 17.654c-2.2 3.51-2.392 8.074-.081 11.854c3.285 5.373 10.363 7.098 15.811 3.857c5.446-3.24 7.199-10.22 3.914-15.597z
    */
    //Adding scale to SVG_gauge_meter
    for (let index = 0; index <= maxValue; index++) {
        //var thisAng = 0;//index/maxValue*180;
        const rr = 30;
        var xx = 0;

        /* if(index < (maxValue/2)){xx = 20 + rr*(1-Math.cos(thisAng*toRadians));}
        else{thisAng = 180 - thisAng;xx = 60 + rr*Math.cos(thisAng*toRadians);} */
        var pos = buildPath(index,rr,20);
        xx = pos[0];
        if (index == maxValue/2){xx = 55;}
        
        var yy = pos[1];
        if(index == maxValue){xx = 85;}
        const myText = buildSVGtext(xx,yy,index);
        svgGroup.appendChild(myText);
    }
    
    svgGroup.appendChild(svgBkgPath);
    svgGroup.appendChild(svgPath);    

    subDiv.appendChild(svgGroup);
    const subDivVal = document.createElement("div");
    subDivVal.setAttribute("class","value");
    subDivVal.innerHTML = htmlTxt;
    subDiv.appendChild(subDivVal);

    return subDiv;
}
function buildPath(inValue,radio,xOffset){
    //calc circ_path based on MaxValue = 6m/s
    var beta = 0; 
    var dx = 0;

    if (inValue < (maxValue/2)){
        beta = inValue * 38.614 - 25.842;
        dx = xOffset + radio*(1 - Math.cos(beta*toRadians));
    }else{
        beta = 90 - (inValue - 3)*38.614;
        //angle = 180 - angle;//231.566
        dx = 60 + radio*Math.cos(beta*toRadians);
    }
    var flag = 0;
    var dy = 68 - radio*Math.sin(beta*toRadians); //68

    if (inValue == 0){dy=90;}
    if (inValue == 6){
        flag = 1;
        dx = 105;
        dy = 90;
    }
    if (inValue == 5){flag = 1;}
    //thisPath = "M 15 90 A 50 50 0 " + flag + " 1 " + String(dx) + " "+ String(dy);

    var arr = [];
    arr.push(dx);
    arr.push(dy);
    arr.push(flag);
    return arr;
}
function buildSVGtext(dx,dy,text){
    const svgText = document.createElementNS('http://www.w3.org/2000/svg','text');
    svgText.setAttribute("x",dx);
    svgText.setAttribute("y",dy);
    svgText.setAttribute("fill","#bed2e0");
    svgText.setAttribute("font-family","Verdana");
    svgText.setAttribute("font-size","small");
    svgText.textContent = String(text);
    return svgText
}

(async ()=>{
    // thisHour = 0, 3, 6,..., 21
    for(let jdx= 0; jdx < dataHours.length; jdx++){
        const path = build_path(jdx);
        try {
            const response = await fetch(path);
            const data = await response.json();
            var newHour = parseInt(dataHours[jdx]);
            build_array(newHour,data);
        } catch (error) {
            console.log(error);
        }
    }
    //console.log("curr",curr_weather.length);
    build_plot(result);
    //var img_url = "";
    //let temp_max_min = maxmin[0];//the date: myData.curr_weather[0][0]
    const lastElm = curr_weather.length-1;
    var text = "<h2 id='this_place'></h2><h3 class='no-padding'>"+ days[today] +", "+ months[monty-1] + " " + tag + " "+curr_weather[lastElm].hour_min+"</h3>";
    text += "<div class='clearfix'><span class='large'>" + 
    "&emsp;"+curr_weather[lastElm].temp + "&#8451;</span><span id='now_weather' class='middle'></span>" + 
    "<h4>Max "+ maxmin[0] + "&#8451;&emsp;Min " + maxmin[1] +  "&#8451;</h4></div>";
    document.getElementById("curr_weather").innerHTML = text;

    var detailsDiv = document.getElementById("weather_details");
    text = "<h4>mm/H</h4><h2 id='rainProb'></h2>";
    //console.log("rain1H",Math.round(curr_weather[lastElm].rain));
    var rainDiv = buildGaugeMeter(Math.round(curr_weather[lastElm].rain),"RAIN",text);
    detailsDiv.appendChild(rainDiv);

    text = "<h2><br><br>" + curr_weather[lastElm].humid + "%</h2>";
    var humidDiv = buildProgressCircle(curr_weather[lastElm].humid,"HUMIDITY",text);
    detailsDiv.appendChild(humidDiv);

    text = "<h4>m/s<br/>"+get_wind_desc(curr_weather[lastElm].wind) +"</h4><h2>" + 
    windChar(curr_weather[lastElm].windDir) + "</h2>";
    var kelly = Math.round(curr_weather[lastElm].wind);
    var windDiv = buildGaugeMeter(kelly,"WIND",text);
    detailsDiv.appendChild(windDiv);
    
})();

function build_array(hour,gotData){
    // void function, 
    // fills "result" array with data/hour, and "zoey" Obj with currentData
    // here I should distinguish between Max and Min at every 10min obs.
    const limit = 2;
    for(let idx = hour; idx <= hour + limit; idx++){
        var aux = build_attrib(idx);
        if (gotData[aux] === undefined){break;}
        const abby = {"hour":idx,"temp":gotData[aux].temp[0],"humid":gotData[aux].humidity[0],
        "wind":Math.round(gotData[aux].wind[0]) ,"windDir":gotData[aux].windDirection[0],"rain":gotData[aux].precipitation1h[0]};
        result.push(abby);
    }
    //get last data of each JSON object
    var lena = Object.keys(gotData)[Object.keys(gotData).length-1];
    //console.log(hour,lena,gotData[lena].temp[0]);
    /*if(currMin < 20){currMin = 60;currHH = currHH -1;}*/
    //console.log(lena.slice(-6,-4),lena.slice(-4,-2));
    // zoey: last elm of each json array, data/10min
    const zoey = {"hour_min":lena.slice(-6,-4)+":"+lena.slice(-4,-2),"temp":gotData[lena].temp[0],
    "humid":gotData[lena].humidity[0],"wind":gotData[lena].wind[0],"windDir":gotData[lena].windDirection[0],
    "rain":gotData[lena].precipitation1h[0]};
    curr_weather.push(zoey);
    //var lena = get_min_attr(idx);
    //return result;
}

function yellow_dust(){
    // 0:0~2, 1:3~5, 2:6~8, 3:9~11, 4:12~14, 5:15~17,6:18~20,7:21~23
    let myIdx = 0;
    for (let idx = 0; idx < mod3_hours.length; idx++) {
        /*if (dataHours.includes(currHH)){myIdx = idx;break;}*/
        if(currHH <= mod3_hours[idx]){
            myIdx = idx;
            // console.log("idx",myIdx);
            break;
        }
    }
    if (currHH > 21){
        //display next day forecast
        let today = new Date(jahre+"-"+monty+"-"+tag);
        let tomorrow = new Date(today);
        // let aux = tomorrow.setDate(today.getDate()+1)
        // console.log("whatDay",new Date(aux *1000));
        tag = tag +1;
    }
    const pm25Div = document.getElementById("pm25_div");
    const pm25Title = document.createElement("h3");
    pm25Title.innerText = "Yellow dust forecast";
    pm25Div.appendChild(pm25Title);
    const imgName = pm25_url + jahre + zeroPad(monty) + zeroPad(tag) + zeroPad(mod3_hours[myIdx]) + "00_kosafcst-s_jp_jp.png";
    // console.log(currHH,"pm25img",imgName);
    const centDiv = document.createElement("div");
    centDiv.setAttribute("class","column-right float-left");
    const outDiv = document.createElement("div");
    outDiv.setAttribute("class","outer_div");
    const innDiv = document.createElement("div");
    innDiv.setAttribute("class","inner_div");

    const myDiv = document.createElement("div");
    myDiv.innerHTML = "<img src='" + imgName + "' onerror='this.onerror=null;this.src=\"../assets/100_0999.jpg\"'/>";
    innDiv.appendChild(myDiv);
    outDiv.appendChild(innDiv);
    centDiv.appendChild(outDiv);
    pm25Div.appendChild(centDiv);
}

function build_plot(json_array){
    // fetch yellow dust forecast
    yellow_dust();
    /*d3js bar plot-> https://jsfiddle.net/matehu/w7h81xz2/38/*/
    const containDiv = document.getElementById("weather_bar");
    const leftDiv = document.createElement("div");
    leftDiv.setAttribute("id","leftAxis");
    leftDiv.setAttribute("class","column-left float-left");
    const rightDiv = document.createElement("div");
    rightDiv.setAttribute("id","rightAxis");
    rightDiv.setAttribute("class","column-third float-left");

    const centerDiv = document.createElement("div");
    centerDiv.setAttribute("class","column-right float-left");
    const outerDiv = document.createElement("div");
    outerDiv.setAttribute("class","outer");
    const innerDiv = document.createElement("div");
    innerDiv.setAttribute("class","inner");

    const mainDiv = document.createElement("div");
    mainDiv.setAttribute("id","mainPlot");

    innerDiv.appendChild(mainDiv);
    outerDiv.appendChild(innerDiv);
    centerDiv.appendChild(outerDiv);
    containDiv.appendChild(leftDiv);
    containDiv.appendChild(centerDiv);
    containDiv.appendChild(rightDiv);

    const xSize = 735,ySize=450;
    var margin = {top:40,right:20,bottom:50,left:0},
    w = xSize - margin.left - margin.right,
    h = ySize - margin.top - margin.bottom;
    
    /* Y temp: left axis*/
    const tMin = d3.min(json_array,(d)=>{return d.temp;});
    const tMax = d3.max(json_array,(d)=>{return d.temp;});
    maxmin.push(tMax);
    maxmin.push(tMin);
    //console.log(tMin,tMax);
    const svgLeft = d3.select("#leftAxis")
    .append("svg").attr("width",36).attr("height",ySize)
    .append("g")
    .attr("transform","translate(" + 35 + "," + margin.top + ")");
    const yScale = d3.scaleLinear()
    .domain([Math.round(tMin)-2,tMax+1]).range([h,0]);
    svgLeft.append("g").call(d3.axisLeft(yScale)).attr("font-size","12");
    svgLeft.append("g").append("text").text("\u2103").attr("x",-24).attr("y",-10);

    /* Y2 humid: right axis */
    const humidMin = d3.min(json_array,(d)=>{return d.humid;});
    const humidMax = 100;//d3.max(json_array,(d)=>{return d.humid;});
    
    const svgRight = d3.select("#rightAxis")
    .append("svg").attr("width",35).attr("height",ySize)
    .append("g")
    .attr("transform","translate(" + 5 + "," + margin.top + ")");

    /*Rain mm/H scale 
    const rainMin = d3.min(json_array,(d)=>{return d.rain;}), 
    rainMax = d3.max(json_array,(d)=>{return d.rain;});
    const yRain = d3.scaleLinear().domain([rainMin,rainMax+1]).range([h,0]);
    svgRight.append("g").call(d3.axisRight(yRain));*/

    const yHumid = d3.scaleLinear()
    .domain([humidMin-5,humidMax])
    .range([h,0]);
    svgRight.append("g").call(d3.axisRight(yHumid));//.attr("transform","translate("+w+",0)");
    svgRight.append("g").append("text").text("%").attr("x",10).attr("y",-10);

    var svg2 = d3.select("#mainPlot")
    .append("svg")
    .attr('width',w+margin.left+margin.right)
    .attr('height',h+margin.top+margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);
    var xScale=d3.scaleBand().range([0,w])
    .domain(hours)
    /*.domain(json_array.map(function(d){return d.hour;})) //scale up to currHour*/
    .padding(0.3);
    svg2.append("g")
    .attr("transform","translate(0,"+0+")")
    .call(d3.axisTop(xScale))
    .selectAll("text")
    .attr("transform","translate(0,0)");
    //.attr("font-size","12");
    //.style("text-anchor","middle");

    /* Humidity: bar plot */
    svg2.selectAll("bar")
    .data(json_array).enter()
    .append("rect")
    .attr("x",function(d){
      return xScale(d.hour);})
    .attr("width",xScale.bandwidth())
    .attr("fill","#bed2e040")
    .attr("rx",8)
    .attr("height",function(d){return h-yScale(0);})
    .attr("y",function(d){return yScale(0);});
    svg2.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y",function(d){return yHumid(d.humid);})
    .attr("height",function(d){return h-yHumid(d.humid);})
    .delay(function(d,i){return(i*100)});

    /* Temperature: square plot */
    svg2.append("g")
    .selectAll("squares")
    .data(json_array).enter()
    .append("rect")
    .attr("x",(d)=>{return xScale(d.hour)+7;})
    .attr("y",(d)=>{return yScale(d.temp);})
    .attr("width","10")
    .attr("height","10")
    /*.append("circle")
    .attr("cx",function(d){return xScale(d.hour)+13;})
    .attr("cy",function(d){return yScale(d.temp);})
    .attr("r",5)*/
    .style("fill","#cc274c");

    // add curve: https://d3-graph-gallery.com/graph/shape.html
    /*var fillLine = d3.line()
    .x((d)=>{return xScale(d.hour);}).y((d)=>{return yScale(d.temp);})
    .curve(d3.curveBasis);
    svg2.append("path").attr("d",fillLine(json_array))
    .attr("stroke","#cc274c").attr("stroke-width","4px")
    .attr("fill","none");*/

    // add text to dots/squares
    let adjHeight = -11;
    svg2.append("g").selectAll(".txtTemp").data(json_array).enter()
    .append("text").attr("class","txtTemp")
    .text((d,i)=>{if((i%2)===0){return d.temp+"\u2103";}})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+13;})
    .attr("y",(d)=>{return yScale(d.temp)+adjHeight;})
    .attr("font-size","11px");

    /* windSpeed: text */
    svg2.append("g").selectAll(".txtWind").data(json_array).enter()
    .append("text").attr("class","txtWind").text(function(d){return d.wind+"m";})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+9;})
    .attr("y",(d)=>{return h-5;})
    .attr("font-size","11px");

    /* windDirection */
    //adjHeight = 0;
    svg2.append("g").selectAll(".txtWindDir").data(json_array).enter()
    .append("text").attr("class","txtWindDir")
    .text((d)=>{return windChar(d.windDir);})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+13;})
    .attr("y",(d,i)=>{
        adjHeight = (i%2) === 0?23:38;
        return h + adjHeight;
    })
    .attr("font-size","11px");
    /*rain amount in mm/hour*/
    svg2.append("g").selectAll(".txtRain").data(json_array).enter()
    .append("text").attr("class","txtRain")
    .text((d)=>{return d.rain;})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+9;})
    .attr("y",(d)=>{return h-25;})
    .attr("font-size","11px");
    //prediction curve
    var thisCurve = d3.line()
    .x((d)=> xScale(d.xp))
    .y((d)=> yScale(d.yp))
    .curve(d3.curveCardinal);

    svg2.append("path")
    .attr("d",thisCurve(ngo_pred))
    .attr("fill","none")
    .attr("stroke","#ffeea6")
    .attr("stroke-width","3px")
    .attr("stroke-dasharray","5,5");
}

/** might be helpful
async function convToUpper(data){
    return data.toUpperCase();
}
async function main(){
    const lowrCase = ["Vicky Vette","Alison Taylor","Armani Black"];
    const upperArr = await Promise.all(await lowrCase.map(async (word)=>{
        return await convToUpper(word)
    }));
    console.log(upperArr);
}
main();*/
