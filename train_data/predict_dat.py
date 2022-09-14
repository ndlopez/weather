#data manipulation
import numpy as np
import pandas as pd
from datetime import datetime

#plots
import matplotlib.pyplot as plt
plt.style.use('fivethirtyeight')
plt.rcParams['lines.linewidth'] = 1.5

#modeling and forecasting
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Lasso
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Require Visual C++ tools, not avail on Windows11
'''
from skforecast.ForecasterAutoreg import ForecasterAutoreg
from skforecast.ForecasterAutoregCustom import ForecasterAutoregCustom
from skforecast.ForecasterAutoregMultiOutput import ForecasterAutoregMultiOutput
from skforecast.model_selection import grid_search_forecaster
from skforecast.model_selection import backtesting_forecaster
'''
from joblib import dump,load
import warnings

#fetch data
# url = 'https://raw.githubusercontent.com/JoaquinAmatRodrigo/skforecast/master/data/h2o_exog.csv'
url = "../data/data_20220802_20220812.csv"

# custom_date_parse = lambda x: datetime.strptime(x, "%Y-%m-%d %H")
# when merging date and hour cols: 
data = pd.read_csv(url,parse_dates={'date_time':[0,1]},sep=',')
# data = pd.read_csv(url,sep=',')
# print(data.head())
# data = data.rename(columns={'fecha':'date'})
data['date_time'] = pd.to_datetime(data['date_time'],format='%Y-%m-%d %H:%M')
# data['hour'] = pd.to_datetime(data['hour'])
data = data.set_index('date_time')
# data= data.rename(columns={'x':'y'})
data = data.asfreq('H') # H: hourly ,MS: Monthly started
data = data.sort_index()
print(data.head())

# print(data.info())

print(f'number of rows with missing vals: {data.isnull().any(axis=1).mean()}')

# verify that temporary index is complete
# (data.index== pd.date_range(start=data.index.min(),end=data.index.max(),freq=data.index.freq)).all()

# if empty vals then fill in gaps
#data.asfreq(freq='1hour',fill_value=np.nan)

# split data into train-test
# steps=36 # the last 36 months are used as the test to eval the predict capacity of the model
steps = 42 # the last 45 hours are used 
data_train = data[:-steps]
data_test = data[-steps:]

print(f"train dates: {data_train.index.min()} --- {data_train.index.max()} (n={len(data_train)})")
print(f"test dates: {data_test.index.min()} --- {data_test.index.max()} (n={len(data_test)})")
print(data.columns.tolist())

myCol = "temp"
fig, ax= plt.subplots(figsize=(9,4))

data_train[myCol].plot(ax=ax,label='train')
data_test[myCol].plot(ax=ax,label='test')
ax.legend()
plt.title("August 2022")
plt.ylabel('\u2103', style='italic', loc='top')
plt.show()

#create and train forecaster
"""forecaster = ForecasterAutoreg(regresssor = RandomForestRegressor(random_state=123),lags=6)
forecaster.fit(y=data_train['y'])
forecaster

# predictions
mysteps = 36
predict = forecaster.predict(steps=mysteps)
predict.head(5)
#nshould display 5 sets of data
# plot
fig,ax = plt.subplots(figsize=(9,4))
data_train['y'].plot(ax=ax,label='train')
data_test['y'].plot(ax=ax,label='test')
predict.plot(ax=ax,label='predictions')
ax.legend()
plt.show()"""
