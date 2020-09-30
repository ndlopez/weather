# Scrape weather data

Get the current weather, temperature, probability of precipitation, humidity and wind-speed, every 3 hours.

Source [tenki.jp/神戸市の天気](https://tenki.jp/forecast/6/31/6310/28100/3hours.html). Explore other cities at tenki.jp

Two scripts scrape the data:

1. <get_tenki.sh> Using curl, grep, and other commands to fetch, and clean the data.

  (all the above commands are available at Xcode tools)
  
2. <get_tenki.py> Using Python3.8., BeautifulSoup and urllib (data is now formatted, please go to More on ...)

Output characters are in Japanese.

Both scripts scrape the data, however, #2 can get weather forecast data for tomorrow.

## More on <get_tenki.py>

How to run:

$ sh fix_tenki.sh

Getting weather data...
Today's weather data fetched!
Tomorrow's weather data fetched!
Formatting data...

Weather for: 2020-09-30
時刻    気温  天気 降水確率 降水量  湿度 風速
3   20.0  晴れ    0   0  88  2
6   19.0  晴れ    0   0  94  1
9   23.1  晴れ    0   0  82  1
12  25.2  晴れ    0   0  70  1
15  27.0  晴れ    0   0  48  2
18  23.6  晴れ    0   0  66  2
21  21.7  晴れ   10   0  76  2
24  20.7  曇り   20   0  74  2
Tomorrow's weather
Weather for: 2020-10-01
時刻    気温  天気 降水確率 降水量  湿度 風速
3   20.5  曇り   20   0  76  2
6   19.6  曇り   10   0  80  1
9   21.5  曇り   10   0  74  1
12  24.0  曇り    0   0  64  2
15  27.4  晴れ    0   0  50  3
18  23.7  晴れ    0   0  58  4
21  21.5  晴れ    0   0  69  2
24  20.1  晴れ    0   0  87  1

---------------------------------------------------
<fix_tenki.sh> runs <get_tenki.py> and <plot_tenki.py>, cleans data using SED.

<get_tenki.py> generates 2 files at <data> folder: 

- get_tenki.csv (today's weather) and 
- get_tenki2.csv (tomorrow' weather)

<plot_tenki.py> (name deceiving file), requires pandas and datetime modules.

Reads the above generated files from <data> folder

and formats the ouput by transposing the rows by columns of the CSV file.

## Issues with urllib:

If unable or get an *SSL certificate* error when using <urllib> module:
(Solution found on StackOverflow)

Go to the folder where Python is installed, e.g., in Mac OS it is installed in the Applications folder with the folder name 'Python 3.8'. Now double click on 'Install Certificates.command'. 
  
On a different setup and can't find this file, the file merely runs:

$ pip install --upgrade certifi

On debian:

$ sudo update-ca-certificates --fresh

$ export SSL_CERT_DIR=/etc/ssl/certs
