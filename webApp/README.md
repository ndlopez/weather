# Weather Application

This repository is mostly for learning purposes (PHP in particular).

Weather data scraped from [tenki.jp](www.tenki.jp) because of HTML format. Other options are Yahoo!Tenki and WeatherNews. The first one, is not nicely formatted and difficult to scrape. Probably using its API will be better... but as I saw it, once requested it only returns the data for the current hour. The second one, is actually easy to scrape, I will probably add such script later on.

## LAMP settings
- OS: Debian 11
- HTTP server: Apache
- DB: MariaDB
- PHP ver: 7.4

### Installation on Windows 11 - WSL 

1. Enable apache modules:
    sudo a2enmod rewritesudo service apache2 restart
    Install HTTP server:
    sudo apt install apache2
    check if running with: sudo service apache2 status
2. sudo apt install mariadb-server mariadb-client
    check if running with: sudo service mariadb status
3. sudo apt-get install php7.4 libapache2-mod-php7.4 php7.4-mysql php7.4-curl php7.4-json php7.4-gd php-memcached php7.4-intl php7.4-mbstring php7.4-xml php7.4-zip
4. sudo mysql_secure_installation

### WSL special commands
Usually on Linux systems, the following works:
- sudo systemctl start/stop/status <what_service>
- sudo systemctl enable/disable <what_service>

However, on WSL things are a lil' different, hence:
- sudo service <what_service> start/stop/status
- sudo chkconfig <what_service> on/off

## XAMPP settings
Using [XAMPP](https://www.apachefriends.org/) and setting a remote server...
MySQL: Create a new user to create DB

## REST API using PHP
Head to:<br>
[MyAPi](http://webapp.physics/rest-api/index.php/datos/list?limit=10)

It should display weather data (up to 10)<br>
However the output has some characters that cannot be JSON parsed, thus it throws the following:<br>
SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data.

## PHP help
Found on stuckUnderFlow (by Mayur Shah):<br>
PHP usually works by executing any bits of code and printing all output directly to the browser. If you say "echo 'Some text here.';", that string will get sent the browser and is emptied from memory.<br>
What output buffering does is say "Print all output to a buffer. Hold onto it. Don't send ANYTHING to the browser until I tell you to."<br>
So what this does is it buffers all your pages' HTML into the buffer, then at the very end, after the tag, it uses ob_get_contents() to get the contents of the buffer (which is usually all your page's HTML source code which would have been sent the browser already) and puts that into a string.<br>
ob_end_clean() empties the buffer and frees some memory. We don't need the source code anymore because we just stored it in $pageContents.<br>
Then, lastly, by doing a simple find & replace on your page's source code ($pageContents) for any instances of '' and replace them to whatever the $pageTitle variable was set to. Of course, it will then replace <title><!--TITLE--></title> with Your Page's Title. After that, echo the $pageContents, just like the browser would have.

---
Environment: Panasonic Let'sNote/Linux Fedora 34<br>
Languages: PHP, Python, JavaScript, Ruby, and Shell<br>
Editors: VIM and Emacs
