#SQL code
SHOW DATABASES;
CREATE DATABASE tenki;
CREATE TABLE weather_data(hour INT, weather VARCHAR(10), 
temp FLOAT, rainProb INT, mmRain INT, humid INT, wind INT, windDir VARCHAR(10));
SHOW TABLES;
INSERT INTO weather_data VALUES(17,\"曇り\",2.2,0,0,66,6,\"西北西\");

#Add a column to table
ALTER TABLE tenki ADD date DATE;

#Insert data only in spec cols. It adds a new row with NULL values
INSERT INTO tenki(date) VALUES(2022-03-03)

#The following will add values to selected rows
UPDATE tenki SET date = '2022-03-03' WHERE rainProb = 0

#to delete an entire column
ALTER TABLE tenki DROP COLUMN date;

#add at the beginning of the table
ALTER TABLE tenki ADD COLUMN date DATE FIRST;

#delete rows from table
DELETE FROM tenki WHERE date = "2022-03-05";

