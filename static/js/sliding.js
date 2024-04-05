
/*<link rel="stylesheet" type="text/css" href="../js/slideshow.css">

<div class="slideshow-container" id="slides"></div>

<div style="text-align:center">
  <span class="dot"></span> 
  <span class="dot"></span> 
  <span class="dot"></span> 
  <span class="dot"></span> 
  <span class="dot"></span> 
  <span class="dot"></span> 
  <span class="dot"></span> 
  <span class="dot"></span>
</div>*/

let urls = "https://www.data.jma.go.jp/gmd/env/kosa/fcst/img/surf/jp/2024";
let slideIdx = 0;
const kate = new Date();
let heure = [0,3,6,9,12,15,18,21];
const slid = document.getElementById("pm25_div");
// slid.addEventListener("onclick",showSlides);
let txt = "",jdx;
let amy = "", lena = "";
for (let idx in heure){
    jdx = String(heure[idx]);
    if (heure[idx] <10) jdx = "0" + String(heure[idx]);
    if (heure[idx] > 0){lena = "mySlides";}
    txt += `<div id="slide${idx}" class=${lena}><img src="${urls}0${kate.getMonth()+1}0${kate.getDate()}${jdx}00_kosafcst-s_jp_jp.png" style="width:100%">` //</div>
    amy += "<span class='dot'></span>";
    // <div class="numbertext">${jdx}/${String(heure.length)}</div>
    txt += `<div class="text_kate">2024-0${kate.getMonth()+1}-0${kate.getDate()} ${jdx}:00</div></div>`;
}
amy = "<div style='text-align:center'>" + amy + "</div>";
slid.innerHTML = txt + amy;

function showSlides() {
  document.getElementById("slide0").classList.add("mySlides");
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIdx++;
  if (slideIdx > slides.length) {slideIdx = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIdx-1].style.display = "block";  
  dots[slideIdx-1].className += " active";
  setTimeout(showSlides, 3000); // Change image every 2 seconds
}
