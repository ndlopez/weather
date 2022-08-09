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

---
Environment: Panasonic Let'sNote/Linux Fedora 34<br>
Languages: PHP, Python, JavaScript, Ruby, and Shell<br>
Editors: VIM and Emacs
