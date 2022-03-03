#SQL code
SHOW DATABASES;
CREATE DATABASE tenki;
CREATE TABLE weather_data(hour INT, weather VARCHAR(10), 
temp FLOAT, rainProb INT, mmRain INT, humid INT, wind INT, windDir VARCHAR(10));
SHOW TABLES;
INSERT INTO weather_data VALUES(17,\"曇り\",2.2,0,0,66,6,\"西北西\");
