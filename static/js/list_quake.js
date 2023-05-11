/*
    New feature to be added later:
    Up to a certain date all earthquakes in Japan
    https://www.jma.go.jp/bosai/quake/data/list.json
    From the above url fetch json field and request data to the following path
    https://www.jma.go.jp/bosai/quake/data/ + jsonFileName
    jsonFileName = 20230325071721_20230325071439_VXSE5k_1.json
*/
const quake_url = "https://www.jma.go.jp/bosai/quake/data/list.json";

gotdata();

async function gotdata(){
    const this_info = await get_info();
    let tagHeure = new Date(this_info.det_time);
    let this_date = (tagHeure.getMonth()+1) + "月" + tagHeure.getDate() + "日";
    let this_time = tagHeure.getHours() + ":" + tagHeure.getMinutes();
    const main_div = document.getElementById("quake_info");
    main_div.setAttribute("class","row");
    main_div.innerHTML = "<div class='column float-left'><h3>Earthquake and Seismic Intensity Information</h3></div>" + "<div class='column float-left'><p>M "+ 
    this_info.magnitud + " in " + this_info.location + "<br/>on " + this_date + " @" + this_time + "</p></div>";

    //console.log(tagHeure);
}

async function get_info(){
    let openMap = "https://www.openstreetmap.org/#map=11/";
    const response = await fetch(quake_url);
    const data = await response.json();
    let det_time = data[0]["at"];
    let location = data[0]["anm"];
    let magni = data[0]["mag"];
    let coord = data[0]["cod"]; //+36.4+138.1+0/
    let lat = coord.split("+")[1], lon= coord.split("+")[2];
    openMap += lat + "/" + lon;
    console.log(lat,lon,aux);
    return {"location":location,"det_time":det_time,"magnitud":magni,"link":aux}; 
}