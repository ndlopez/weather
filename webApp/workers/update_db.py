#!/usr/bin/python3.9
'''
Update ../data/tenki_hour.txt to remote DB.

Requires ../workers/grep_tenki.sh to first scrape data
Otherwise it will append already updated data
'''
__author__ = "ndlopez"
__email__="github.com/ndlopez/weather_app"

import mysql.connector
from datetime import datetime

thisDate=datetime.now()
heute=thisDate.strftime("%Y-%m-%d")
heure=thisDate.strftime("%H")
#print("Today is: ",heute,heure)

USERNAME="root" #input("DB user: ")
update_db=input("Update DB? (y/n):")

HOSTNAME="webapp.physics" #input("host: ")
USERPASW=input("DB user pass: ")
DB_NAME="tenki"
TAB_NAME="weather_data"
mydb = mysql.connector.connect(host=HOSTNAME,user=USERNAME,password=USERPASW,database=DB_NAME)
mycursor = mydb.cursor()

tenki_file=input("Input data path: ") #"../data/tenki_hour202105.txt"

def create_db():
    #Create DB and table

    mycursor.execute("SHOW DATABASES")
    aux="CREATE DATABASE " + DB_NAME
    mycursor.execute(aux)
    aux="CREATE TABLE "+ TAB_NAME + "(date DATE, hour INT, weather VARCHAR(10), temp FLOAT, rainProb INT, mmRain INT, humid INT, wind INT, windDir VARCHAR(10))"
    mycursor.execute(aux)
    mycursor.execute("SHOW DATABASES")


#mycursor.execute("SHOW TABLES")

#muon g-2 https://physics.aps.org/articles/v14/47
#Must add a column for date
oneLine=[]
countErr=0
with open(tenki_file,encoding="utf-8") as data_file:
    for line in data_file:
        myQuery='INSERT INTO ' + TAB_NAME +' VALUES('
        oneLine=line.split(",") #CSV input
        if not oneLine[0] == "date":
            if oneLine[4] == "---" or oneLine[4] == "(%)":
                oneLine[4] = -1
            if oneLine[6] == "(%)" or oneLine[6] == "--":
                oneLine[6] = -1
            if len(oneLine[8]) > 6:
                oneLine[8] = '\"静穏\"'
            aux=oneLine[0]
            oneLine[0]="'"+aux+"'"
            aux=oneLine[2]
            oneLine[2]="'"+aux+"'"
            aux=oneLine[8]
            oneLine[8]="'"+aux+"'"
            
            for item in oneLine:
                myQuery= myQuery + str(item) + ","
            myQuery = myQuery[:-1] + ")"

            try:
                if update_db == "y":
                    mycursor.execute(myQuery)
                    mydb.commit()
                print(myQuery,end=" ")
                print("OK")
            except:
                countErr=countErr+1
                print(myQuery,"ERROR :(")

#myQuery='INSERT INTO tenki VALUES(17,\"曇り\",2.2,0,0,66,6,\"西北西\")'
#mycursor.execute(myQuery)
#mydb.commit()
print(countErr,"Errors found when updating DB")
#aux="SELECT * FROM " + TAB_NAME + " ORDER BY " + TAB_NAME + ".date ASC"
#SELECT * FROM `tenki` ORDER BY `date`,`hour` ASC; 
aux = "SELECT * FROM " + TAB_NAME + " WHERE date = '" + heute + "' AND hour = " + heure  
mycursor.execute(aux)
result = mycursor.fetchone()
print("Printing data from DB: ",DB_NAME)
allVars=["Today","hour","weather","temperature","rainProb","mmRain","humidity","windSpeed","windDir"]
idx=0
for item in result:
    print(allVars[idx],":",item)
    idx = idx + 1
