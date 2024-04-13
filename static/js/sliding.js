/*Slideshow, courtesy of w3schools. Adapted for this site by DLopez. */
// let urls = "https://www.data.jma.go.jp/gmd/env/kosa/fcst/img/surf/jp/2024";
const svgObj = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="120" height="120" fill="#bed2e0" stroke="#bed2e0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle fill="#dc322f" stroke="#dc322f" stroke-width="2" cx="16" cy="16" r="14"/><path d="M9 25 L25 16 9 7 Z" /></svg>';

let kate = new Date();
let heure = [0,3,6,9,12,15,18,21];
const slid = document.getElementById("pm25_div");
// slid.addEventListener("onclick",showSlides);
let txt = "",jdx;
let amy = "", lena = "";
if (kate.getHours() > 21){
  //display next day forecast
  let tody = new Date(jahre+"-"+monty+"-"+tag);//vars def on build_data.js
  let morrow = new Date(tody);
  let aux = morrow.setDate(tody.getDate()+1)
  kate = new Date(aux);
  // myIdx = 0;
}
for (idx in heure){
    jdx = String(heure[idx]);
    if (heure[idx] <10) jdx = "0" + String(heure[idx]);
    if (heure[idx] > 0){lena = "mySlides";}
    txt += `<div id="slide${idx}" class=${lena}>
    <img src="${pm25_url}${jahre}${zeroPad(kate.getMonth()+1)}${zeroPad(kate.getDate())}${jdx}00_kosafcst-s_jp_jp.png" style="width:100%">` //</div>
    amy += "<span class='dot'></span>";
    txt += `<div class="text_kate">2024-${zeroPad(kate.getMonth()+1)}-${zeroPad(kate.getDate())} ${jdx}:00</div></div>`;
}
amy = `<div style='text-align:center'>${amy}</div> <div>${svgObj}</div>`;
slid.innerHTML = txt + amy;
idx = 0;
function showSlides() {
  document.getElementById("slide0").classList.add("mySlides");
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (jdx = 0; jdx < slides.length; jdx++) {
    slides[jdx].style.display = "none";  
  }
  idx++;
  if (idx > slides.length) {idx = 1}    
  for (jdx = 0; jdx < dots.length; jdx++) {
    dots[jdx].className = dots[jdx].className.replace(" active", "");
  }
  slides[idx-1].style.display = "block";  
  dots[idx-1].className += " active";
  setTimeout(showSlides, 3000);
}
