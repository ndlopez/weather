oneDay=`seq 24`
echo `seq -w 23`" 0"
tomoro=$((`date +%s` + 86400))
day=`date -d @$tomoro +%d`
saver=$(echo "-- "`for num in $oneDay;do  echo "2022-03-"$day; done`)
echo $saver
##tenki_file=~/Public/get_weather/data/23106_1hour.html
##humid0=$(grep -m2 -w "humidity" -A 48 ${tenki_file} | cut -f3 -d'>' | cut -f1 -d'<')
##echo $humid0
#humid1=$(grep -m2 -w "humidity" -A 48 ${tenki_file} | cut -f2 -d'>' | cut -f1 -d'<')
##echo $humid1
##the following will replace any char from a variable
#echo ${humid0//--/}${humid1//湿度/}
    
