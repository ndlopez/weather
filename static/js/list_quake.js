/*
    New feature to be added later:
    Up to a certain date all earthquakes in Japan
    https://www.jma.go.jp/bosai/quake/data/list.json
    From the above url fetch json field and request data to the following path
    https://www.jma.go.jp/bosai/quake/data/ + jsonFileName
    jsonFileName = 20230325071721_20230325071439_VXSE5k_1.json
*/
const quake_url = "https://www.jma.go.jp/bosai/quake/data/list.json";
const openMap = "https://www.openstreetmap.org/#map=11/";

const these_Months = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];
const these_Days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const loc_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="#bed2e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="16" cy="11" r="4" /><path d="M24 15 C21 22 16 30 16 30 16 30 11 22 8 15 5 8 10 2 16 2 22 2 27 8 24 15 Z" /></svg>';

gotdata();

//pointMap();
//console.log(pointMap(135,35,div_map_1));
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
    
    main_div.innerHTML = `<div class='column float-left no_mobil'><h3>Earthquake and Seismic Intensity Information</h3><p>M${this_info[0].magnitud} in <a target='_blank' href='${this_info[0].link}'> ${this_info[0].location} </a><br/>on ${this_date} ${this_time}</p></div><div id='top_map' class='column float-left' style='height:200px;'></div>`;
    
    if(this_info[0].longitud != "0"){
        const map = L.map('top_map').setView([this_info[0].latitud-0.05, this_info[0].longitud], 9);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let popMsg = this_date + " " + this_time + '<br>M' + this_info[0].magnitud + " in " + this_info[0].location;

        L.marker([this_info[0].latitud, this_info[0].longitud]).addTo(map)
            .bindPopup(popMsg)
            .openPopup();
    }
    // Recent events
    const list_div = document.getElementById("quake_list");
    const div_title = document.createElement("h2");//and Seismic
    div_title.innerHTML = `Earthquake Information<br>Last ${this_info.length}-recent events`;
    list_div.appendChild(div_title);
    //create as many group div as info is available
    for(let idx = 0;idx < this_info.length; idx++){
        const groupDiv = document.createElement("details");
        const sumDiv = document.createElement("summary");
        sumDiv.setAttribute("class","row");
        sumDiv.style.backgroundColor = "#bed2ed40";
        if(this_info[idx].magnitud > 5.0){
            sumDiv.style.backgroundColor = "#cc274c";
        }
        
        const tina = getDateHour(this_info[idx].det_time);

        texty = `<div class='column3 float-left' style='margin:0;border-radius:inherit;'><div class='row-date'><h2 class='col-date float-left'> ${tina.tag} </h2><div class='col-date float-left' style='text-align:left;padding-left:0;'><p><strong> ${these_Days[tina.day]} </strong></p><p><small>${these_Months[tina.monty-1]}</small></p></div></div></div>`;

        //texty += "<div class='column3 float-left'><h4>" + zero_pad(tina.heure)+
        //":" + zero_pad(tina.minute) + "</h4></div>";

        texty += `<div class='column3 float-left' style='margin:0;border-radius:inherit;'><div class='row-date'> 
        <div class='col-date float-left' style='text-align:left;padding-left:0;'><p></p><p><strong> ${zero_pad(tina.heure)}:${zero_pad(tina.minute)}</p></div><h3 class='col-date float-left'>M${this_info[idx].magnitud}</h3></div></div>`;
        
        texty += `<div class='column3 float-left'>
        <span style='margin-top:'><p>${this_info[idx].location}</p></span></div>`;
        // <a target='_blank' href='${openMap}${this_info[idx].latitud}/${this_info[idx].longitud}'></a>
        sumDiv.innerHTML = texty;
        groupDiv.appendChild(sumDiv);
        const mapDiv = document.createElement("div");
        mapDiv.setAttribute("id","div_map_"+idx);
        mapDiv.style.height = "200px";
        // mapDiv.innerHTML = "some"; 
        //let aux = pointMap(this_info[idx].latitud,this_info[idx].longitud,idx);
        groupDiv.appendChild(mapDiv);
        list_div.appendChild(groupDiv);
    }
    for(let jdx=0; jdx < this_info.length; jdx++){
        const map = L.map("div_map_"+jdx).setView([this_info[jdx].latitud-0.05, this_info[jdx].longitud], 10);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let popMsg = this_info[jdx].location;//this_date + " " + this_time;

        L.marker([this_info[jdx].latitud, this_info[jdx].longitud]).addTo(map)
            .bindPopup(popMsg)
            .openPopup();
    }
}

async function pointMap(latitud=35,longitud=135){
    await gotdata();
    const map = L.map("div_map_1").setView([latitud-0.05, longitud], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let popMsg = "this_date" + " " + "this_time";

    L.marker([latitud, longitud]).addTo(map)
        .bindPopup(popMsg)
        .openPopup();
}

async function get_info(){
    const response = await fetch(quake_url);
    const data = await response.json();
    let five_events = [];
    const num_events = 5;

    for (let idx = 0;idx < num_events;idx++) {
        let det_time = data[idx]["at"];
        let location = data[idx]["anm"];
        let magni = data[idx]["mag"]; // -23.2+170.7
        let coord = data[idx]["cod"]; //+36.4+138.1-1000/ or +34.3+139.2+100
        if(coord.includes("-")){
            coord = data[idx]["cod"].split("-")[0];
        }
        coord = coord.split("+");
        let lat = coord[1], lon= coord[2];
        if(lat === undefined || lon === undefined){
            lat = 0; lon=0;
        }else{
            let eve = {"location":location,"det_time":det_time,"magnitud":magni,"latitud":lat,"longitud":lon};
            five_events.push(eve);
        }
        // openMap += lat + "/" + lon;
        // console.log(lat,lon,openMap);        
    }
    //console.log(five_events);
    return five_events;
}

function zero_pad(tit){return (tit<10)?"0"+tit:tit;}