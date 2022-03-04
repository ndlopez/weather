#!/bin/bash
# <grep_tenki.sh>
# Scrape data from <www.tenki.jp>
# Runs every 2-hours [9~17] via cron
# Output is displayed using <show_tenki.sh> script
# Gnome-Shell extension <ondo@moji.physics> runs the above script
# every 30mins after boot.
# !A copy is saved on Dropbox/Programming/scripts/
# Help:
# seq 1 24 -> prints 1 2 3 4...24
# backslash \n
# 
area=23106 #23109 #home, 23106 Nagoya,Naka-ku
rate=1hour #3hours
_url=https://tenki.jp/forecast/5/26/5110/${area}/${rate}.html
#_url1hr=https://tenki.jp/forecast/5/26/5110/23109/1hour.html
#神戸市の天気 https://tenki.jp/forecast/6/31/6310/28100/3hours.html
#img_url=https://static.tenki.jp/static-images/radar/recent/pref-26-large.jpg
#also pref-26-middle.jpg is available

#storing temporary data
myHome=$HOME/Documents/pyworks/weather_app/data
cd $myHome

#setting up variables
tenki_file=../data/${area}_${rate}.html
hour_file=../data/tenki_hour.txt
temp_file=$HOME/Dropbox/data/tenki_temp.txt

monty=$(date "+%m")
day=$(date "+%d")
hora=$(date "+%H")
#min=$(date "+%M")
#week=("日" "月" "火" "水" "木" "金" "土")
#echo ${week[0]} -> 日 
#lena= ${week[4]} #`LC_ALL=ja_JP date "+%a"`

#testing = 1, download data = 0
if [[ $1 == "1" ]];then
   sleep 1
else
   curl ${_url} -o ${tenki_file}
   #2 > err.log
fi
#confirm if data was downloaded
if [[ ! -f ${tenki_file} ]];then
    echo "Network error :("
    exit 100
fi
    #else echo "Data downloaded"
    #cp ${rate}.html ${tenki_file}

#echo "今日 ${monty}月${day}日(${week[4]}), Now "`date +"%H:%M"`
#get current weather conditions every hour
oneDay=`seq 24`
heute=$(echo "-- "`for num in $oneDay;do echo "2022-"$monty"-"$day;done`)

tomoro=$((`date +%s` + 86400))
day=`date -d @$tomoro +%d`
morgen=$(echo " -- "`for num in $oneDay;do echo "2022-"$monty"-"$day;done`)
heure=$(echo "--";seq -w 1 24;echo "--";seq -w 1 24)

weather=$(grep -m50 -w "weather" ${tenki_file} | cut -f6 -d'"')

#echo "天気 "${weather} > ${temp_file}
#echo "気温\n(℃ )"${temp} > ${temp_file}
temp=$(grep -m2 -w "temperature" -A 47 ${tenki_file} | cut -f3 -d'>' | cut -f1 -d'<')
#echo "降水確率"${prob} > ${hour_file}
prob=$(grep -m2 -w "prob-precip" -A 48 ${tenki_file} | cut -f3 -d'>' | cut -f1 -d'<')

mmhr=$(grep -m2 -w "precipitation" -A 47 ${tenki_file} | cut -f3 -d'>' | cut -f1 -d'<')

#echo "湿度"${humid} > ${hour_file}
humid=$(grep -m2 -w "humidity" -A 48 ${tenki_file} | cut -f3 -d'>' | cut -f1 -d'<')

#echo "風速\n(m/s)"${wind_speed} > ${temp_file}
wind_speed=$(grep -m2 -w "wind-speed" -A 47 ${tenki_file} | cut -f3 -d'>' | cut -f1 -d'<')

windy=$(grep -m2 -w "wind-blow" -A 94 ${tenki_file} | cut -f3 -d'=' | cut -f1 -d' ')

#merge all columns by variable
fecha=$heute$morgen
paste <(echo $fecha | tr ' ' '\n') <(echo $heure | tr ' ' '\n') <(echo "--"$weather | tr ' ' '\n') <(echo "--"${temp} | tr ' ' '\n') <(echo ${prob} | tr ' ' '\n') <(echo "--"${mmhr} | tr ' ' '\n') <(echo ${humid} | tr ' ' '\n') <(echo "--"${wind_speed} | tr ' ' '\n') <(echo $windy | tr ' ' '\n') -d' ' > ${hour_file}

sed -i 's/.*/ &/' ${hour_file}
#head -49 ${hour_file} > 
#data reduction
offset=`expr 51 - $hora`
tail -$offset ${hour_file} > ${temp_file}
echo "Updated on " `date` >> ${temp_file}
#{ tail -$offset ${hour_file};echo "Updated on "`date` } > ${temp_file}
