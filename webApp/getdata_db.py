import mysql.connector

db_con = mysql.connector.connect(
    host="192.168.0.159",
    user="kathy",
    password="galileo2022",
    database="weather")

cursorObj = db_con.cursor()
query = "SELECT * FROM tenki"
cursorObj.execute(query)

result= cursorObj.fetchall()

date=[]
hour=[]
temp=[]

for item in result:
    print(item[0])

with open("../data/weather_030508.csv","w") as data_file:
    data_file.write("#date,hour,temp,rainProb,mmRain,humid,wind,windDir\n")
    for item in result:
        #aux = str(item) + "\n" # (...)
        aux=""
        for idx in range(len(item)):
            aux = aux + str(item[idx]) + ","
        #aux = str(item[0]) + "," + str(item[1]) + "," + str(item[2]) + "\n"
        aux = aux[:-1] + "\n"
        data_file.write(aux)
        '''date.append(item[0])
        hour.append(item[1])
        temp.append(item[2])'''

#close DB
db_con.close()
print("Done")
#print(date,hour,temp)
