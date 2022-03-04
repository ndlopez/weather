oneDay=`seq 24`
tomoro=$((`date +%s` + 86400))
day=`date -d @$tomoro +%d`
saver=$(echo "-- "`for num in $oneDay;do  echo "2022-03-"$day; done`)
echo $saver
