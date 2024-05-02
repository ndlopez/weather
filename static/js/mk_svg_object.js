/* Functions to build 3 svg objects to display information */
function buildProgressCircle(percent,title,texty) {
    const radius = 52;
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
    
    const circumference = radius * 2 * Math.PI;
    svgCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    svgCircle.style.strokeDashoffset = `${circumference}`;
    const offset = circumference - percent / 100 * circumference;
    svgCircle.style.strokeDashoffset = offset;
    subDiv.appendChild(svgGroup);
    const subDivVal = document.createElement("div");
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

    const posXY = buildPath(value,radius,10);
    const myPath = `M 15 90 A 50 50 0 ${posXY[2]} 1 ${posXY[0]} ${posXY[1]}`;
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
        let xx = 0;

        /* if(index < (maxValue/2)){xx = 20 + rr*(1-Math.cos(thisAng*toRadians));}
        else{thisAng = 180 - thisAng;xx = 60 + rr*Math.cos(thisAng*toRadians);} */
        const pos = buildPath(index,rr,20);
        xx = pos[0];
        if (index == maxValue/2){xx = 55;}
        
        let yy = pos[1];
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
    let beta = 0; 
    let dx = 0;

    if (inValue < (maxValue/2)){
        beta = inValue * 38.614 - 25.842;
        dx = xOffset + radio*(1 - Math.cos(beta*toRadians));
    }else{
        beta = 90 - (inValue - 3)*38.614;
        //angle = 180 - angle;//231.566
        dx = 60 + radio*Math.cos(beta*toRadians);
    }
    let flag = 0;
    let dy = 68 - radio*Math.sin(beta*toRadians); //68

    if (inValue == 0){dy=90;}
    if (inValue == 6){
        flag = 1;
        dx = 105;
        dy = 90;
    }
    if (inValue == 5){flag = 1;}
    //thisPath = "M 15 90 A 50 50 0 " + flag + " 1 " + String(dx) + " "+ String(dy);

    let arr = [];
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
