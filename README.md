# Get weather data
Scrape weather data from [tenki.jp/神戸市の天気](https://tenki.jp/forecast/6/31/6310/28100/3hours.html)

Two attempts were made to scrape the data:

- Using curl, grep, and other commands to fetch, and clean the data.

  (all the above commands are available at Xcode tools)
- Using Python3.8. Requires: BeautifulSoup and urllib
  
If unable or get an SSL certificate error when using <urllib> module:

(Solution found on StackOverflow)

Go to the folder where Python is installed, e.g., in Mac OS it is installed in the Applications folder with the folder name 'Python 3.8'. Now double click on 'Install Certificates.command'. 
  
On a different setup and can't find this file, the file merely runs:

$ pip install --upgrade certifi

On debian:

$ sudo update-ca-certificates --fresh

$ export SSL_CERT_DIR=/etc/ssl/certs

