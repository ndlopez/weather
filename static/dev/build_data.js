const jma_url = "https://www.jma.go.jp/bosai/amedas/data/point/51106/2023";
/*current date and time*/
let myDate = new Date();
var monty = myDate.getMonth() + 1;
var tag = myDate.getDate();
var hh = myDate.getHours();
var hours = [],dataHours = [],ondo=[];
/* build array of hours: 0 ~ hh */
for (let idx=0;idx < hh;idx++){
    hours.push(idx);
    if(idx % 3 == 0){
        dataHours.push(idx);
    }
}
function zeroPad(tina){
    return (tina<10)?"0"+tina:tina;
}
function build_path_attr(jdx,tim){
    //0 < jdx < 8:
    var path = jma_url + zeroPad(monty) + zeroPad(tag) + "_"+zeroPad(dataHours[jdx]) + ".json";
    var atrib = "2023"+zeroPad(monty)+zeroPad(tag)+zeroPad(tim)+"0000";
    return {"Path":path,"Atrib":atrib};
}

async function get_data(){
    var myTime = 11;//hh;// hh-1, hh-2
    //Must validate if myTime is within fetched data: if myTime > dataHours[7]
    var gotThis = build_path_attr(dataHours.length -2,myTime);
    const response = await fetch(gotThis.Path);
    const data = await response.json();
    console.log(myTime,data[gotThis.Atrib].temp[0]);// currhour
    var aux = gotThis.Atrib.replace(myTime,myTime-1);
    console.log(aux,myTime-1,data[aux].temp[0]);
    aux = gotThis.Atrib.replace(myTime,zeroPad(myTime-2));
    console.log(aux,myTime-2,data[aux].temp[0]);
}
get_data();
console.log(hours,dataHours,build_path_attr(0,12));