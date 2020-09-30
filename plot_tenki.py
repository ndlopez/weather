#reading output file from get_tenki.py
from datetime import date, timedelta
import pandas as pd
#import matplotlib.pyplot as plt

#plt.rcParams['figure.figsize']=10,4
#plt.close('all')

col_names=["時刻","天気","気温","降水確率","降水量","湿度","風速"]
df = pd.read_csv('data/get_tenki.csv',header=None) #comment='#'
#the following line will delete the 0..6 indexing
df.set_index(['時刻'],inplace=True)
heute=date.today()
df_tr = df.T
#find a way to replace '---' with 0
#df_tr = df_tr.replace('---',0)
print("Weather for:",heute)
print(df_tr)
print("Tomorrow's weather")
df2 = pd.read_csv('data/get_tenki2.csv',header=None)
df2.set_index(['時刻'],inplace=True)

morgen = heute + timedelta(1) #better get time data from html
df_tr2 = df2.T
print("Weather for:",morgen)
print(df_tr2)
#up to here OK!
'''
#fig, ax = plt.subplots(nrows=3,ncols=1,sharex=True)
fig1=plt.subplot(131)
df_tr.temp = pd.to_numeric(df_tr.temp)
ondo = df_tr.temp
ondo.plot(kind='line',color='g')
plt.ylabel('Temperature[C]')
plt.grid()

df_tr.prob = pd.to_numeric(df_tr.prob)
prob = df_tr.prob
#prob.plot(kind='line')
df_tr.precip = pd.to_numeric(df_tr.precip)
precip = df_tr.precip

df_tr.humid = pd.to_numeric(df_tr.humid)
humid=df_tr.humid
fig2=plt.subplot(132,sharex=fig1)
humid.plot(kind='line',color='r')
plt.ylabel('Humidity[%]')
plt.grid()

df_tr.wind=pd.to_numeric(df_tr.wind)
wspeed=df_tr.wind
fig3=plt.subplot(133,sharex=fig1)
wspeed.plot(kind='line')
plt.xlabel('hours')
plt.ylabel('wind speed[m/s]')
plt.grid()
plt.show()
'''
