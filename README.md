# Weather website

[Live demo](https://ndlopez.github.io/weather)

Display current weather conditions for a certain location in Japan.
<!--Weather applications developed with various technologies and environments (GNU/Linux, MacOS and Windows). Uses APIs from different providers.-->

## Features

- Fully responsive website
- All data rendered with d3.js
- Map rendered with openStreetMap.org and Leaflet.js

## Credits

- Weather and earthquake data are from the Japan Metereological Agency
- Moon rise/set times are monthly scrapped from timeanddate.com
- Sun rise/set times are courtesy of dayspedia.com
- Some of the website icons are from [Dan Klammer](https://danklammer.com/bytesize-icons/)
- Weather icon for iOS is from [Rain icon created by iconixar - Flaticon](https://www.flaticon.com/free-icons/rain)

---
## Tested Environment: 

- Desktop: Mozilla Firefox ESR v.102

- Mobile: DuckDuckGo browser [iOS and Android app](https://duckduckgo.com/app)

## Developing Environment

- OS: Panasonic Let'sNote/Linux Fedora 36<br>
- Languages: JavaScript, CSS, HTML <br>
- Editors: Emacs and Codium

<!--
append png image to svg Object
<svg xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink">
...
    <image
    width="100" height="100"
    xlink:href="data:image/png;base64,IMAGE_DATA"/>
    ...
</svg>
data per hour for current day here:
https://www.jma.go.jp/bosai/amedas/data/point/51106/20221007_09.json
format seems to be yyyymmdd_hh.json, hh< currHour, hh=0,3,6,9,...
also https://www.jma.go.jp/bosai/amedas/#area_type=offices&area_code=230000&amdno=51106&format=table1h&elems=53414
might be helpful when rain https://codepen.io/aureliendotpro/pen/kVwyVe

To no longer borrow radar image from tenki.jp; img:border:0;
top layer updated every hour 
https://www.data.jma.go.jp/obd/bunpu/img/wthr/306/wthr_306_202306192100.png
css attrib: position:absolute;top:1px;left:1px;
background https://www.data.jma.go.jp/obd/bunpu/img/munic/munic_306.png
css: position:absolute;top:1px;left:1px;width:520px;opacity:0.5;
ocean is white, either color on Gimp or directly using CSS
https://www.data.jma.go.jp/obd/bunpu/img/wthr/306/wthr_306_202306240900.png
https://www.timeanddate.com/scripts/sunmap.php?iso=20231020T1740
weather map: https://www.jma.go.jp/bosai/weather_map/
-->
