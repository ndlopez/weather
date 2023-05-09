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
    console.log(this_info);
}

async function get_info(){
    const response = await fetch(quake_url);
    const data = await response.json();
    let det_time = data[0]["rdt"];
    let location = data[0]["anm"];
    let magni = data[0]["mag"];
    
    return {"location":location,"det_time":det_time,"magnitud":magni}; 
}