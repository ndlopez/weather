/*
    New feature to be added later:
    Up to a certain date all earthquakes in Japan
    https://www.jma.go.jp/bosai/quake/data/list.json
    From the above url fetch json field and request data to the following path
    https://www.jma.go.jp/bosai/quake/data/ + jsonFileName
    jsonFileName = 20230325071721_20230325071439_VXSE5k_1.json
*/
const quake_url = "https://www.jma.go.jp/bosai/quake/data/list.json";
const theseMonths = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];
const theseDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const loc_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#bed2e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="16" cy="11" r="4" /><path d="M24 15 C21 22 16 30 16 30 16 30 11 22 8 15 5 8 10 2 16 2 22 2 27 8 24 15 Z" /></svg>';

gotdata();

function getDateHour(isoStr){
    // isoStr: ISO format 2023-04-20T20:04:23
    const gotDate = new Date(isoStr);
    return {"monty":gotDate.getMonth() + 1,"tag":gotDate.getDate(),"day":gotDate.getDay(),"heure":gotDate.getHours(),"minute":gotDate.getMinutes()};
}

async function gotdata(){
    const this_info = await get_info();
    let tagHeure = new Date(this_info[0].det_time);
    let this_date = (tagHeure.getMonth()+1) + "月" + tagHeure.getDate() + "日";
    let this_time = zero_pad(tagHeure.getHours())  + ":" + zero_pad(tagHeure.getMinutes());
    const main_div = document.getElementById("quake_info");
    main_div.setAttribute("class","row");
    main_div.innerHTML = "<div class='column float-left no_mobil'><h3>Earthquake and Seismic Intensity Information</h3><p>M " + this_info[0].magnitud + " in <a target='_blank' href='" + this_info[0].link + "'>" + this_info[0].location + "</a><br/>on " + this_date + " @" + this_time + "</p></div><div id='map' class='column float-left' style='height:200px;'></div>";
    
    if(this_info[0].longitud != "0"){
        const map = L.map('map').setView([this_info[0].latitud-0.05, this_info[0].longitud], 10);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let popMsg = this_date + " " + this_time + '<br>M' + this_info[0].magnitud + " in " + this_info[0].location;

        L.marker([this_info[0].latitud, this_info[0].longitud]).addTo(map)
            .bindPopup(popMsg)
            .openPopup();
    }
    const list_div = document.getElementById("quake_list");
    //create as many group div as forecast are available
    for(let idx = 0;idx < this_info.length; idx++){
        const groupDiv = document.createElement("div");
        groupDiv.setAttribute("class","row");
        const tina = getDateHour(this_info[idx].det_time);

        texty = "<div class='column3 float-left' style='margin:0;border-radius:inherit;'><div class='row-date'>" + 
        "<h2 class='col-date float-left'>"+ tina.tag + "</h2><div class='col-date float-left' style='text-align:left;padding-left:0;'><p><strong>"+theseDays[tina.day] + 
        "</strong></p><p><small>"+theseMonths[tina.monty-1]+"</small></p></div></div></div>";
        
        texty += "<div class='column3 float-left'><p>M" +
        this_info[idx].magnitud + " in " + this_info[idx].location + "</p>"+
        "<span style='margin-top:'>"+
        gotData.forecast[4][idx]+"%</span></div>";

        texty += "<div class='column3 float-left'><h4>"+tempMin+"&#8451; | "+tempMax+"&#8451;</h4></div>";
        if((idx == 1) && (gotData.wind[2] != undefined)){
            texty += "<p style='text-align:center;font-size:small;'>"+gotData.weather[2]+"、"+gotData.wind[2]+"</p>";            
        }
        groupDiv.innerHTML = texty;
        list_div.appendChild(groupDiv);
    }
}

async function get_info(){
    let openMap = "https://www.openstreetmap.org/#map=11/";
    const response = await fetch(quake_url);
    const data = await response.json();
    let five_events = [];

    for (let idx = 0;idx < 5;idx++) {
        let det_time = data[idx]["at"];
        let location = data[idx]["anm"];
        let magni = data[idx]["mag"]; // -23.2+170.7
        let coord = data[idx]["cod"]; //+36.4+138.1-1000/ or +34.3+139.2+100
        if(coord.includes("-")){
            coord = data[0]["cod"].split("-")[0];
        }
        coord = coord.split("+");
        let lat = coord[1], lon= coord[2];
        if(lat === undefined || lon === undefined){
            lat = 0; lon=0;
        }
        openMap += lat + "/" + lon;
        // console.log(lat,lon,openMap);
        let eve = {"location":location,"det_time":det_time,"magnitud":magni,"link":openMap,"latitud":lat,"longitud":lon};
        five_events.push(eve);
    }
    console.log(five_events);
    return five_events;
}

function zero_pad(tit){return (tit<10)?"0"+tit:tit;}