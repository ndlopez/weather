# Scrape weather data

Get the current weather, temperature, probability of precipitation, humidity and wind-speed, every 3 hours.

Source [tenki.jp/神戸市の天気](https://tenki.jp/forecast/6/31/6310/28100/3hours.html). Explore other cities at tenki.jp

Two scripts scrape the data:

1. <get_tenki.sh> Using curl, grep, and other commands to fetch, and clean the data.

  (all the above commands are available at Xcode tools)
2. <get_tenki.py> Using Python3.8., BeautifulSoup and urllib (data is not formatted)

Output characters are in Japanese.

Both scripts scrape the data, however, #2 can get weather forecast data for tomorrow.

## Issues with urllib:

If unable or get an *SSL certificate* error when using <urllib> module:
(Solution found on StackOverflow)

Go to the folder where Python is installed, e.g., in Mac OS it is installed in the Applications folder with the folder name 'Python 3.8'. Now double click on 'Install Certificates.command'. 
  
On a different setup and can't find this file, the file merely runs:

$ pip install --upgrade certifi

On debian:

$ sudo update-ca-certificates --fresh

$ export SSL_CERT_DIR=/etc/ssl/certs
