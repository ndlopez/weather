async function disp_info(kat){
    const jennaDiv = document.createElement("div");
    jennaDiv.setAttribute("class","clearfix");
    jennaDiv.style.background = "url(../assets/daylen.svg) no-repeat";
    jennaDiv.style.backgroundPosition = "50% 0%";
    jennaDiv.setAttribute("id","sunRiseSet");
    texty = "<div class='column3 float-left'><img src='../assets/sunrise.svg' width=32/><p class='no-margin'>"+gotTime.sunrise[0]+":"+gotTime.sunrise[1]+
    "</p></div>" + "<div class='column3 float-left'><h3>"+ gotData.wind[0] +
    "</h3></div><div class='column3 float-left'><img src='../assets/sunset.svg' width=32/><p class='no-margin'>" + 
    gotTime.sunset[0]+":"+gotTime.sunset[1] + "</p></div>";
    jennaDiv.innerHTML = texty;
    weathernfo.appendChild(jennaDiv);
}
function build_obj_pos(){
    //for some reason not parsed :(
    const svgSubG = document.createElementNS(svg_org,'g');
    svgSubG.setAttribute("font-size","30");svgSubG.setAttribute("fill","#ececec");
    svgSubG.textContent = '<text x="'+(0.1*width)+'" y="'+(0.25*width)+'">\u2601</text>'+
    '<text x="10" y="40">\u2601</text>';
}

const svgLine = document.createElementNS(svg_org,'rect');
svgLine.setAttribute("x",0);//26
svgLine.setAttribute("y",0.5*width);
svgLine.setAttribute("stroke","#50653b");//059862 smbc color
svgLine.setAttribute("fill","#50653b");//green
svgLine.setAttribute("width",width);// -2*26
svgLine.setAttribute("height",30);
//svgLine.setAttribute("x2",width);svgLine.setAttribute("y2",0.5*width);
//var myPath = "M240 100 A40 40 40 10 90 100 0"; semicirc
//var myPath = "M3.034,56C18.629,24.513,52.554,2.687,91.9,2.687S165.172,24.513,180.766,56h3.033 C168.016,23.041,132.807,0.098,91.9,0.098C50.995,0.098,15.785,23.041,0.002,56H3.034z";
const svgPath = document.createElementNS(svg_org,'path');
svgPath.setAttribute("id","road");
svgPath.setAttribute("stroke","#2e4054");
svgPath.setAttribute("stroke-width","2");
svgPath.setAttribute("fill","#2e4054");//#E8B720
var myPath = "M100 180 L130 150 170 150 200 180Z";
svgPath.setAttribute("d",myPath);

async function getIconCodes(){
const resp = await fetch("../data/w_codes.json");
const data = await resp.json();return data;}