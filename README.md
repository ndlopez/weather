# Weather applications

[Live demo](https://ndlopez.github.io/weather)

## Features

- Fully responsive
- All Data rendered with d3.js
- Weather and earthquake data are from Japan Metereological Agency
- Rain radar image is grabbed from tenki.jp
- Moon rise/set times are scrapped from timeanddate.com
- Sun rise/set times is courtesy of dayspedia.com
- Map rendered with openStreetMap.org and Leaflet.js

## WebApp

Running on local WSL Debian server

[repo](https://github.com/ndlopez/webapp)

## CLI application

Grep data from tenki.jp. Displays current weather conditions, updates every 3 hours.

## GNOME Extension

Display a notification every 30min. It auto-updates.

Works on GNOME 30, 40+ versions

Create a new branch for this repository

	$ git branch gnome-ext

	$ git checkout -b gnome-ext

Then pull-request to merge with main

## MacOS Notification

Display @the Notification Center and pop up every 30 minutes.

Requires manual update and conversion of CJK chars to Unicode.

Branch created "notif"

---
Enviroment: 
- MacBookPro/MacOS 15.5<br>
- Panasonic Let'sNote/Linux Fedora 36<br>

Languages: Shell, JavaScript, Ruby<br>
Editors: VIM and Emacs
