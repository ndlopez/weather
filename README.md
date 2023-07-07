# Weather applications

[Live demo](https://ndlopez.github.io/weather)

Weather applications developed with various technologies and OS-environments (GNU/Linux, MacOS and Windows). Uses APIs from different providers, listed on features.

## Features

- Fully responsive website
- All data rendered with d3.js
- Weather and earthquake data are from Japan Metereological Agency
- Moon rise/set times are scrapped from timeanddate.com
- Sun rise/set times are courtesy of dayspedia.com
- Map rendered with openStreetMap.org and Leaflet.js

## [WebApp](https://github.com/ndlopez/webapp)

Runs on local WSL Debian server

## [CLI application](https://github.com/ndlopez/weather/tree/main/get_tenki)

First attempt to extract weather data from a webpage. Grep data from tenki.jp. Displays current weather conditions, updates every 3 hours.

## [GNOME Extension](https://github.com/ndlopez/weather/tree/main/tenki%40moji.physics)

Display a notification every 30min. It auto-updates.

Works on GNOME 30, 40+ versions

![Screenshoot](tenki%40moji.physics/Screenshot.png)

Create a new branch for this repository

	$ git branch gnome-ext

	$ git checkout -b gnome-ext

Then pull-request to merge with main

## [MacOS Notification](https://github.com/ndlopez/weather/tree/main/notif_app/mac_os)

Display @the Notification Center and pop up every 30 minutes.

Requires manual update and conversion of CJK chars to Unicode.

Branch created "notif"

[repo](https://github.com/ndlopez/weather/tree/main/xbar_plugin)

## [Windows Notification](https://github.com/ndlopez/weather/tree/main/notif_app/windows)

Windows PopUp message application (to be added)

---
Enviroment: 
- MacBookPro/MacOS 15.5<br>
- Panasonic Let'sNote/Linux Fedora 36<br>

Languages: Shell, JavaScript, Ruby<br>
Editors: VIM and Emacs
