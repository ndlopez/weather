#!/bin/bash
#Update weather_app repository

cd ../
echo `pwd`
rm *~
git add *
echo "Updating remote git..."
echo "Pls, enter a message: "
read msg
git commit -m $msg

git push -u origin main
if [ $? == 0 ];then
    echo "Repo updated"
    git status
else
    echo "Something went wrong"
    exit 3
fi
