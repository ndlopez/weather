# Configuration files

## WSL server using Apache2

Append to *apache2.conf*:<br>
Servername localhost
AcceptFilter http none

Move/Update *conf* files to:<br>
	$ /etc/apache2/sites-available/<br>

Also link them to:<br>
	$ ln -s 000-default.conf /etc/apache2/sites-enabled/ <br>

!Note:<br>
Better edit them using VIM
