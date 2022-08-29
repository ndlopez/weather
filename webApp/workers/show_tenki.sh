#!/bin/bash
dat=$HOME/weather_app/data/tenki_tmp.txt
currDay=$(date "+%d ")
today=2022-07-$currDay
currHour=$(date "+%H")
currMin=$(date "+%M")

if [ $currMin -gt 30 ];then
	currHour=`expr $currHour + 1`
	#echo "+1 hr"
fi
nextHour=`expr $currHour + 1`
#echo $today$currHour
grep "$today$currHour" -m 1 $dat
grep "$today$nextHour" -m 1 $dat

