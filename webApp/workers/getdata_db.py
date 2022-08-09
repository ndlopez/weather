'''
Get data from remote DB
'''
__author__ = "ndlopez"
__email__="github.com/ndlopez/weather_app/"

import mysql.connector

HOSTNAME=input("Input hostname: ")
DB_PASS=input("Input DB password: ")

db_con = mysql.connector.connect(host=HOSTNAME,user="root",
    password=DB_PASS,database="weather")

cursorObj = db_con.cursor()
query = "SELECT * FROM tenki"
cursorObj.execute(query)

result= cursorObj.fetchall()

datum=[]

for item in result:
    print(item[0])

def read_data():
    with open("../data/weather_030508.csv","w") as data_file:
        data_file.write("#date,hour,temp,rainProb,mmRain,humid,wind,windDir\n")
        for item in result:
            #aux = str(item) + "\n" # (...)
            if not item[0] == "None":
                aux=""
                for idx in range(len(item)):
                    aux = aux + str(item[idx]) + ","
                #aux = str(item[0]) + "," + str(item[1]) + "," + str(item[2]) + "\n"
                aux = aux[:-1] + "\n"
                data_file.write(aux)

    data_file.close()

#Plotting
myColors=['r','g','b','m','c','k','y']
colors=[]
hour=[]
temp=[]

def get_date():
    

    for item in result:
        #aux = str(item) + "\n" # (...)
        if not item[0] == "None":
            datum.append(item[0])
            hour.append(item[1])
            temp.append(item[2])

    
    jdx=0
    for idx in range(len(datum)-1):
        if datum[idx] == datum[idx +1]:
            colors.append(myColors[jdx])
            jdx=jdx+1
        else:
            colors.append(myColors[jdx])
            jdx=jdx+1

    return hour,temp

#close DB
db_con.close()

colors.append(colors[len(colors)-1])
print("Done")
print(datum,hour,temp)
