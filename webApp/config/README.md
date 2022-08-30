# Configuration files

## WSL server using Apache2

Append to *apache2.conf*:<br>
Servername localhost<br>
AcceptFilter http none

Move/Update *conf* files to:<br>
	$ /etc/apache2/sites-available/<br>

Also link them to:<br>
	$ ln -s 000-default.conf /etc/apache2/sites-enabled/ <br>

## Rest-api
When using the api it is necessary the following file:<br>
<strong>htaccess</strong><br>

Rename it to: *.htaccess* and save it at:<br>

/var/www/html

!Note:<br>
Better edit files with VIM

## Non-related

[Pana](https://stream-28.zeno.fm/pnwpbyfambruv?zs=m9vXss-OR-a2FxxJTU8LSQ)
