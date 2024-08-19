/*
    Fetch data from jma website and organize it to display and plot.
    CORS problem import {buildProgressCircle, buildGaugeMeter } from "https://raw.githubusercontent.com/ndlopez/webApp/main/static/build_svg.js";
*/
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
/* Fetch observation data from jma site and plot */
const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/";//51106/2022
const pm25_url = "https://www.data.jma.go.jp/gmd/env/kosa/fcst/img/surf/jp/";
const cities = [{name:"Nagoya",code:51106},{name:"Takayama",code:52146}];
const cdx = 0; // 0:Nagoya, 1:Takayama
const toRadians = Math.PI/180.0;
const maxValue = 6; //m/s when 10m/s too many scales, should display half
/*current date and time*/
let myDate = new Date(); // should be const
let jahre = myDate.getFullYear();
let monty = myDate.getMonth() + 1;
let tag = myDate.getDate();
const today = myDate.getDay();

let currHH = myDate.getHours();
let currMin = myDate.getMinutes();
currHH = currMin > 21? currHH+1:currHH;

let result = []; //store per hour weather data
let curr_weather = []; //store last entry of JSON weather data
let maxmin = []; // Max/Min temp from obs data
let dataHours = [];
let mod3_hours = [];

/* Autumn: const ngo_pred = [{xp:0,yp:10.0},{xp:7,yp:8.0},{xp:14,yp:15.5},{xp:23,yp:9.0}]; 
const ngo_pred = [{xp:0,yp:14.0},{xp:7,yp:11.0},{xp:14,yp:20.0},{xp:23,yp:12.0}];//spring
let ngo_pred = [{xp:0,yp:27.5},{xp:5,yp:26.0},{xp:14,yp:33.0},{xp:22,yp:28.5}];// summer*/
let ngo_pred = [{xp:0,yp:19.0},{xp:6,yp:18.0},{xp:14,yp:26.0},{xp:23,yp:20.0}];//late spring
const tky_pred = [{xp:0,yp:5.0},{xp:7,yp:3},{xp:14,yp:13},{xp:23,yp:4}];
let hours = [];
let idx = 0;

for (idx; idx < 24; idx++) hours.push(idx);

/* Fixing bug at 0:00 ~ 0:20 */
if (currHH == 0 && currMin < 20){
    // take data from prev day
    let yesterYou = myDate.setDate(myDate.getDate() -1); //unix format
    let auxDate = new Date(yesterYou);
    // Update new dates
    jahre = auxDate.getFullYear();
    monty = auxDate.getMonth() + 1;
    tag = auxDate.getDate();
    // currHH=0 is not good, I want the last data of the day
    currHH = 23;
    currMin = 50;
    console.log("using yesterYou dates", jahre,monty,tag);
}

/* build array every 3 hours: 0 ~ current hh */
dataHours.push(0); // to avoid empty array
for (idx=1; idx < currHH; idx++){ if(idx % 3 == 0){ dataHours.push(idx); } }

for (idx=0; idx < 24; idx++){ if(idx % 3 ==0){ mod3_hours.push(idx); } }

function zeroPad(tit){return /*(tit<10)?"0"+tit:tit;*/String(tit).padStart(2,'0');}

/* wind Direction -> JPchar */
const allDirections = {0:"静穏",1:"北北東",2:"北東",3:"東北東",4:"東",5:"東南東",6:"南東",7:"南南東",8:"南",
9:"南南西",10:"南西",11:"西南西",12:"西",13:"西北西",14:"北西",15:"北北西",16:"北"};

// wind description according to Beaufort scale (up to 6) in m/s
const desc_wind = [{"speed":0.0,"max":0.29,"en":"calm","jp":["静穏","せいおん","煙がまっすぐに昇っていく"]},{"speed":0.3,"max":1.59,"en":"Light Air","jp":["至軽風","しけいふう","煙がたなびくが風向計での計測はできない"]},{"speed":1.6,"max":3.39,"en":"Light Breeze","jp":["軽風","けいふう","顔に風を感じる、木の葉が動き風向計での計測が可能になる"]},
{"speed":3.4,"max":5.49,"en":"Gentle Breeze","jp":["軟風","なんぷう","葉っぱが絶えず動いている、軽い旗がはためく"]},{"speed":5.5,"max":7.99,"en":"Moderate Breeze","jp":["和風","わふう","ホコリが舞い上がり、木の枝が動く"]},
{"speed":8.0,"max":10.79,"en":"Fresh Breeze","jp":["疾風","しっぷう","小さな木がゆり動く、水面にさざ波が立つ"]},{"speed":10.8,"max":13.89,"en":"Strong Breeze","jp":["雄風","ゆうふう","大きな枝が動き、電線がうなり、傘をさすのが困難になる"]},{"speed":13.9,"max":17.19,"en":"Near gale","jp":["強風","きょうふう","木全体がゆれ、風に向かって歩くのが困難になる"]}];
//more at https://www.i-kahaku.jp/friend/kagaku/0306/kaze/index.html
function get_wind_desc(wspeed,sw=true){
    //let thisWind = "";// wspeed is float
    for (let item in desc_wind) {
        if((wspeed >= desc_wind[item].speed) && (wspeed < desc_wind[item].max)){
            console.log("wendy",wspeed,desc_wind[item].jp[0]);//break;
            if (sw) {
                return desc_wind[item].jp[0];
            }else{
                return desc_wind[item].jp[2];
            }                        
        }
    }// return thisWind;    
}
/* filter to get one element
function wendy(arr,query) {return arr.filter((el) => ((el.speed < query) && (el.max > query)));}
const windy = wendy(desc_wind,5.3);*/
function windChar(number){    
    for (let dat in allDirections){
        if(dat == number){
            return allDirections[number];
        }
    }
}
function build_path(jdx){
    //0 < jdx < 8:
    const path = jma_url + cities[cdx].code + "/" + jahre + zeroPad(monty) + zeroPad(tag) + "_" + zeroPad(dataHours[jdx]) + ".json";
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

(async ()=>{
    /*fetch data every 3hrs*/    
    for(let jdx= 0; jdx < dataHours.length; jdx++){
        // thisHour = 0, 3, 6,..., 21
        const path = build_path(jdx);
        try {
            const response = await fetch(path);
            const data = await response.json();
            const newHour = parseInt(dataHours[jdx]);
            build_array(newHour,data);
        } catch (error) {
            console.log(error);
        }
    }

    const lastElm = curr_weather.length-1;
    let gotMax = curr_weather[lastElm]['maxmin'][0];//1 max hour
    let gotMin = curr_weather[lastElm]['maxmin'][2]; // 3 min hour
    // update tendency curve:
    ngo_pred[0]["yp"] = gotMin + 3;
    ngo_pred[1]["yp"] = gotMin;
    ngo_pred[2]["yp"] = gotMax;
    ngo_pred[3]["yp"] = gotMax - 6;
        
    build_plot(result,gotMax,gotMin);
    // let temp_max_min = maxmin[0];//date: myData.curr_weather[0][0]
    // add here how to set ppast date
    let text = `<h2 id="this_place">愛知県西部</h2><h3 class="no-padding">${days[today]}, ${months[monty-1]} ${String(tag)} ${curr_weather[lastElm].hour_min}</h3>`;
    
    text += `<div><span class='large'>&emsp;${curr_weather[lastElm].temp}&#8451;</span><span id='now_weather' class='middle'></span><br><span>${get_wind_desc(curr_weather[lastElm].wind,false)}</span><h4>Max ${gotMax}&#8451;&emsp;Min ${maxmin[1]}&#8451;</h4></div><div id="rainToday"></div>`;//prev ${maxmin[0]}
 
    document.getElementById("curr_weather").innerHTML = text;

    const detailsDiv = document.getElementById("weather_details");
    text = "<h4>mm/10分</h4><h2 id='rainProb'></h2>";
    //console.log("rain1H",Math.round(curr_weather[lastElm].rain));
    const rainDiv = buildGaugeMeter(Math.round(curr_weather[lastElm].rain),"RAIN",text);
    detailsDiv.appendChild(rainDiv);

    text = "<h2><br><br>" + curr_weather[lastElm].humid + "%</h2>";
    const humidDiv = buildProgressCircle(curr_weather[lastElm].humid,"HUMIDITY",text);
    detailsDiv.appendChild(humidDiv);

    text = "<h4>m/s<br/>"+get_wind_desc(curr_weather[lastElm].wind) +"</h4><h2>" + 
    windChar(curr_weather[lastElm].windDir) + "</h2>";
    const kelly = Math.round(curr_weather[lastElm].wind);
    const windDiv = buildGaugeMeter(kelly,"WIND",text);
    detailsDiv.appendChild(windDiv);
    // console.log(curr_weather[lastElm].wind,get_wind_desc(curr_weather[lastElm].wind));
})();

function build_array(hour,gotData){
    /* void function, 
    fills "result" array with data/hour,data/10min, and "zoey" Obj with currentData*/
    // abby are data every hour
    const limit = 2;
    for(let idx = hour; idx <= hour + limit; idx++){
        let aux = build_attrib(idx);
        if (gotData[aux] === undefined){break;}
        const abby = {
            "hour":idx,"temp":gotData[aux].temp[0],
            "humid":gotData[aux].humidity[0],
            "wind":Math.round(gotData[aux].wind[0]),
            "windDir":gotData[aux].windDirection[0],
            "rain":gotData[aux].precipitation1h[0],
            "maxmin":[gotData[aux].maxTemp[0],gotData[aux].maxTempTime['hour'],gotData[aux].minTemp[0],gotData[aux].minTempTime['hour']]
        };
        result.push(abby);
    }
    //get last data of each JSON object
    const lena = Object.keys(gotData)[Object.keys(gotData).length-1];
    //console.log(hour,lena,gotData[lena].temp[0]);
    /*if(currMin < 20){currMin = 60;currHH = currHH -1;}*/
    //console.log(lena.slice(-6,-4),lena.slice(-4,-2));
    // zoey: last elm of each json array, data/10min
    // here Max and Min are separated every 10min obs.
    const zoey = {
        "hour_min":lena.slice(-6,-4)+":"+lena.slice(-4,-2),
        "temp":gotData[lena].temp[0],"humid":gotData[lena].humidity[0],
        "wind":gotData[lena].wind[0],
        "windDir":gotData[lena].windDirection[0],
        "rain":gotData[lena].precipitation10m[0],
        "maxmin":[gotData[lena].maxTemp[0],gotData[lena].maxTempTime['hour'],gotData[lena].minTemp[0],gotData[lena].minTempTime['hour']]
    };
    curr_weather.push(zoey);
    //return result;
}

function yellow_dust(make_div=false){
    // 0:0~2, 1:3~5, 2:6~8, 3:9~11, 4:12~14, 5:15~17,6:18~20,7:21~23
    let myIdx = 0;
    for (let idx = 0; idx < mod3_hours.length; idx++) {
        /*if (dataHours.includes(currHH)){myIdx = idx;break;}*/
        if(currHH <= mod3_hours[idx]){
            myIdx = idx;
            break;
        }
    }
    if (currHH > 21){
        //display next day forecast
        let today = new Date(jahre+"-"+monty+"-"+tag);
        let tomorrow = new Date(today);
        let aux = tomorrow.setDate(today.getDate()+1)
        // console.log("whatDay",new Date(aux));
        aux = new Date(aux);
        monty = aux.getMonth() + 1;
        tag = aux.getDate();
        myIdx = 0;
    }
    const imgName = pm25_url + jahre + zeroPad(monty) + zeroPad(tag) + zeroPad(mod3_hours[myIdx]) + "00_kosafcst-s_jp_jp.png";

    if (make_div){
        const pm25Div = document.getElementById("pm25_div");
        const pm25Title = document.createElement("h3");
        pm25Title.innerText = "Yellow dust forecast";
        pm25Div.appendChild(pm25Title);
        const centDiv = document.createElement("div");
        centDiv.setAttribute("class","column-right float-left");
        const outDiv = document.createElement("div");
        outDiv.setAttribute("class","outer_div");
        const innDiv = document.createElement("div");
        innDiv.setAttribute("class","inner_div");

        const myDiv = document.createElement("div");
        myDiv.innerHTML = `<img src='${imgName}' onerror='this.onerror=null;this.src=\"/assets/Valle_de_la_Luna_small.jpg\"'/>`;
        innDiv.appendChild(myDiv);
        outDiv.appendChild(innDiv);
        centDiv.appendChild(outDiv);
        pm25Div.appendChild(centDiv);}
    return imgName;
}

function build_plot(json_array,thisMax,thisMin){
    // fetch yellow dust forecast
    // sleep til next season: true on Feb, March,May, June 
    /* testing new function to slide images*/
    document.getElementById("yellow-dust").innerHTML = `<a href='${yellow_dust(true)}' target="_blank">Yellow dust</a>`;
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
    outerDiv.style.width = "auto";
    //.outer{width: auto;/*320px;*/  overflow-x: auto;  }
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
    const margin = {top:40,right:20,bottom:50,left:20},
    w = xSize - margin.left - margin.right,
    h = ySize - margin.top - margin.bottom;
    
    /* Y temp: left axis*/
    const tMin = d3.min(json_array,(d)=>{return d.temp;});
    // Max of array d3.max(json_array,(d)=>{return d.temp;});
    const tMax = d3.max(json_array,(d)=>{return d.maxmin[0];});
    //console.log("input",json_array,);
    maxmin.push(tMax);
    maxmin.push(tMin);
    //console.log(tMin,tMax);
    const svgLeft = d3.select("#leftAxis")
    .append("svg").attr("width",36).attr("height",ySize)
    .append("g")
    .attr("transform","translate(" + 35 + "," + margin.top + ")");
    const yScale = d3.scaleLinear()
    .domain([thisMin-1,thisMax+1]).range([h,0]);
    //.domain([Math.round(tMin)-2,thisMax+1]).range([h,0]);
    svgLeft.append("g").call(d3.axisLeft(yScale)).attr("font-size","12");
    svgLeft.append("g").append("text").text("\u2103").attr("x",-24).attr("y",-10); 
    
    const svgRight = d3.select("#rightAxis")
    .append("svg").attr("width",35).attr("height",ySize)
    .append("g")
    .attr("transform","translate(" + 30 + "," + margin.top + ")"); // axisLeft
    //.attr("transform","translate(" + 5 + "," + margin.top + ")"); axisRight
    
    /*Rain mm/H scale 
    const rainMin = d3.min(json_array,(d)=>{return d.rain;}), 
    rainMax = d3.max(json_array,(d)=>{return d.rain;});
    const yRain = d3.scaleLinear().domain([rainMin,rainMax+1]).range([h,0]);
    svgRight.append("g").call(d3.axisRight(yRain));*/
    
    /* Y2 humid: right axis */
    /* const humidMin = d3.min(json_array,(d)=>{return d.humid;});
    const humidMax = 100;//d3.max(json_array,(d)=>{return d.humid;});
    const yHumid = d3.scaleLinear()
    .domain([humidMin-5,humidMax])
    .range([h,0]);
    svgRight.append("g").call(d3.axisLeft(yHumid)); */ 
    //.attr("transform","translate("+w+",0)");
    //svgRight.append("g").append("text").text("%").attr("x",10).attr("y",-10);//Right
    /* Y2 wendy: right axis */
    const wendyMin = 0; //d3.min(json_array,(d)=>{return d.wind;});
    const wendyMax = 12; //d3.max(json_array,(d)=>{return d.wind;});
    const yWendy = d3.scaleLinear()
    .domain([wendyMin,wendyMax])
    .range([h,0]);
    svgRight.append("g").call(d3.axisLeft(yWendy));
    svgRight.append("g").append("text").text("m/s").attr("x",-20).attr("y",-10);//axisLeft

    const svg2 = d3.select("#mainPlot")
    .append("svg")
    .attr('width',w+margin.left+margin.right)
    .attr('height',h+margin.top+margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);
    const xScale=d3.scaleBand().range([0,w])
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

    /* Wendy: bar plot */
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
    // .attr("y",function(d){return yHumid(d.humid);})
    // .attr("height",function(d){return h-yHumid(d.humid);})
    .attr("y",function(d){return yWendy(d.wind);})
    .attr("height",function(d){return h-yWendy(d.wind);})
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
    .append("text").attr("class","txtWind").text(function(d){return d.humid+"";})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+9;})
    .attr("y",(d)=>{return h-5;})
    .attr("font-size","11px");

    /* windSpeed: text */
    /* svg2.append("g").selectAll(".txtWind").data(json_array).enter()
    .append("text").attr("class","txtWind").text(function(d){return d.wind+"m";})
    .attr("text-anchor","middle")
    .attr("x",(d)=>{return xScale(d.hour)+9;})
    .attr("y",(d)=>{return h-5;})
    .attr("font-size","11px"); */

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
    const thisCurve = d3.line()
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
    const lowrCase = ["Vicky V.","Alison Taylor","Candice"];
    const upperArr = await Promise.all(await lowrCase.map(async (word)=>{
        return await convToUpper(word)
    }));
    console.log(upperArr);
}
main();*/
