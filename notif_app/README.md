# Notification app

## MacOS version
Public repository for notification branch, which is set for MacOS environment.

By removing $out_file$ it can work on GNU/Linux as well.

![Screenshot](getTenki_1534.png)

To display as a notification do:<br>

> $ /bin/bash grep_tenki.sh<br>

> $ osascript -l JavaScript notif_app.js

## Windows 10/11 version
Using the Windows notification and PowerShell snippet to display weather data. Once included batch code is set on task Scheduler it will run every set time.

Currently the app uses Python to fetch current data. A binary is in development.
 
## Environment
- MacBookPro, MacOS 15.5
- Panasonic Let's Note, Windows 10 Pro
- Editors: Emacs and VIM
