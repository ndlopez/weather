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
            if oneLine[4] == "---" or oneLine[4] == "(%)":
                oneLine[4] = -1
            if oneLine[6] == "(%)":
                oneLine[6] = -1
            aux=oneLine[0]
            oneLine[0]="'"+aux+"'"
            aux=oneLine[2]
            oneLine[2]="'"+aux+"'"
            for item in oneLine:
                myQuery= myQuery + str(item) + ","
            myQuery = myQuery[:-1] + ")"

            if len(myQuery) > 46:
                print(myQuery,end=" ")
            try:
                mycursor.execute(myQuery)
                mydb.commit()
                print("OK")
            except:
                print("An error occurred :(",myQuery)

#(hour,weather,temp,rainProb,mmRain,humid,wind,windDir)
#myQuery='INSERT INTO tenki VALUES(17,\"曇り\",2.2,0,0,66,6,\"西北西\")'
#mycursor.execute(myQuery)
#mydb.commit()
mycursor.execute("SELECT * FROM tenki")
result = mycursor.fetchone()
print("Printing data from DB")
for xx in result:
    print(xx)

