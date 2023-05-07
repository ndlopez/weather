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