msg=$1
cd ../
echo `pwd`
rm *~
git add *
git commit -m $msg
git push -u origin main
if [ $? == 0 ];then
    echo "Repo updated"
    git status
else
    echo "Something went wrong"
    exit 3
fi
