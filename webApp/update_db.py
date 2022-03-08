#!/usr/bin/python3.9
'''
Update ../data/tenki_hour.txt to remote DB.

Requires ../workers/grep_tenki.sh to first scrape data
Otherwise it will append already updated data
'''
import mysql.connector

tenki_file="../data/tenki_hour.txt"

HOSTNAME=input("host: ")
USERNAME="kathy" #input("DB user: ")
USERPASW=input("user pass: ")
DB_NAME="weather"
TAB_NAME="tenki"
mydb = mysql.connector.connect(host=HOSTNAME,user=USERNAME,password=USERPASW,database=DB_NAME)

mycursor = mydb.cursor()

def create_db():
    #Create DB and table
    mycursor.execute("SHOW DATABASES")
    aux="CREATE DATABASE " + DB_NAME
    mycursor.execute(aux)
    aux="CREATE TABLE "+ TAB_NAME + "(date DATE, hour INT, weather VARCHAR(10), temp FLOAT, rainProb INT, mmRain INT, humid INT, wind INT, windDir VARCHAR(10))"
    mycursor.execute(aux)

#mycursor.execute("SHOW TABLES")

#muon g-2 https://physics.aps.org/articles/v14/47
#Must add a column for date
oneLine=[]
with open(tenki_file) as data_file:
    for line in data_file:
        myQuery='INSERT INTO ' + TAB_NAME +' VALUES('
        oneLine=line.split()
        if not oneLine[0] == "--":
            if oneLine[4] == "---" or oneLine[4] == "(%)":
                oneLine[4] = -1
            if oneLine[6] == "(%)" or oneLine[6] == "--":
                oneLine[6] = -1
            if len(oneLine[8]) < 5:
                oneLine[8] = "--"
            aux=oneLine[0]
            oneLine[0]="'"+aux+"'"
            aux=oneLine[2]
            oneLine[2]="'"+aux+"'"
            for item in oneLine:
                myQuery= myQuery + str(item) + ","
            myQuery = myQuery[:-1] + ")"

            try:
                mycursor.execute(myQuery)
                mydb.commit()
                print(myQuery,end=" ")
                print("OK")
            except:
                print(myQuery,"ERROR :(")

#(hour,weather,temp,rainProb,mmRain,humid,wind,windDir)
#myQuery='INSERT INTO tenki VALUES(17,\"曇り\",2.2,0,0,66,6,\"西北西\")'
#mycursor.execute(myQuery)
#mydb.commit()
aux="SELECT * FROM " + TAB_NAME
mycursor.execute(aux)
result = mycursor.fetchone()
print("Printing data from DB: ",DB_NAME)
for item in result:
    print(item)

