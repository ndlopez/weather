#!/usr/bin/python3.9
import mysql.connector

HOSTNAME=input("host: ")
USERNAME=input("DB user: ")
USERPASW=input("user pass: ")

mydb = mysql.connector.connect(host=HOSTNAME,user=USERNAME,password=USERPASW,database="weather")

mycursor = mydb.cursor()

#mycursor.execute("SHOW DATABASES")
#mycursor.execute("CREATE DATABASE weather")

#mycursor.execute("CREATE TABLE tenki (hour INT, weather VARCHAR(10), temp FLOAT, rainProb INT, mmRain INT, humid INT, wind INT, windDir VARCHAR(10))")

#mycursor.execute("SHOW TABLES")

#muon g-2 https://physics.aps.org/articles/v14/47
#Must add a column for date
oneLine=[]
with open("../data/tenki_hour.txt") as data_file:
    for line in data_file:
        myQuery='INSERT INTO tenki VALUES('
        oneLine=line.split()
        if not oneLine[0] == "--":
            if oneLine[3] == "---" or oneLine[3] == "(%)":
                oneLine[3] = 0
            if oneLine[5] == "(%)":
                oneLine[5] = 0
            aux=oneLine[1]
            oneLine[1]="'"+aux+"'"
            for item in oneLine:
                myQuery= myQuery + str(item) + ","
            myQuery = myQuery[:-1] + ")"

            if len(myQuery) > 46:
                print(myQuery)
            mycursor.execute(myQuery)
            mydb.commit()


#(hour,weather,temp,rainProb,mmRain,humid,wind,windDir)
#myQuery='INSERT INTO tenki VALUES(17,\"曇り\",2.2,0,0,66,6,\"西北西\")'
#mycursor.execute(myQuery)
#mydb.commit()
mycursor.execute("SELECT * FROM tenki")
result = mycursor.fetchone()
for xx in result:
    print(xx)

