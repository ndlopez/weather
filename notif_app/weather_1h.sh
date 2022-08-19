#!/bin/bash
# <xbar.title>Weather from tenki.jp</xbar.title>
# <xbar.version>0.1</xbar.version>
# <xbar.author>Diego Lopez</xbar.author>
# <xbar.author.github>ndlopez</xbar.author.github>
# <xbar.desc>Scrapes data from weathernews.jp</xbar.desc>
# <xbar.image></xbar.image>
# <xbar.dependencies>bash,curl,grep,cut</xbar.dependencies>
# <xbar.abouturl>https://github.com/ndlopez/weather_app</xbar.abouturl>
city_code=23109
pref=aichi
curr_weather=`curl -s https://weathernews.jp/onebox/tenki/$pref/${city_code}/ | grep "weather-now__ul" -A10`
#echo ${curr_weather}
tenki=$(echo ${curr_weather} | cut -f5 -d'>' | cut -f1 -d'<')
temp=$(echo ${curr_weather} | cut -f9 -d'>' | cut -f1 -d'<')
echo $tenki $temp
echo "---"
humid=$(echo ${curr_weather} | cut -f14 -d'>' | cut -f1 -d'<')
#press=18
wind=$(echo ${curr_weather} | cut -f22 -d'>' | cut -f1 -d'<')
sunrise=$(echo ${curr_weather} | cut -f26 -d'>' | cut -f1 -d'&')
sunset=$(echo ${curr_weather} | cut -f28 -d'>' | cut -f1 -d'<')
echo "湿度 "$humid
echo "風 "$wind
echo "日の出 "$sunrise
echo "日の入 "$sunset

