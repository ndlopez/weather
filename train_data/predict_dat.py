#data manipulation
from logging.config import _LoggerConfiguration
import numpy as np
import pandas as pd

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
url = 'https://raw.githubusercontent.com/JoaquinAmatRodrigo/skforecast/master/data/h2o_exog.csv'
data = pd.read_csv(url, sep=',')

data = data.rename(columns={'fecha':'date'})
data['date'] = pd.to_datetime(data['date'],format='%Y/%m/%d')
data = data.set_index('date')
data= data.rename(columns={'x':'y'})
data = data.asfreq('MS') # Monthly started
data = data.sort_index()
print(data.head())

print(f'number of rows with missing vals: {data.isnull().any(axis=1).mean()}')

# verify that temporary index is complete
(data.index== pd.date_range(start=data.index.min(),end=data.index.max(),freq=data.index.freq)).all()

# if empty vals then fill in gaps
# data.asfreq(freq='30min',fill_value=np.nan)

#split data into train-test
steps=36 # the last 36 months are used as the test to eval the predict capacity of the model
data_train = data[:-steps]
data_test = data[-steps:]

print(f"train dates: {data_train.index.min()} --- {data_train.index.max()} (n={len(data_train)})")
print(f"test dates: {data_test.index.min()} --- {data_test.index.max()} (n={len(data_test)})")

fig, ax= plt.subplots(figsize=(9,4))
data_train['y'].plot(ax=ax,label='train')
data_test['y'].plot(ax=ax,label='test')
ax.legend();
plt.show()

exit()
#create and train forecaster
forecaster = ForecasterAutoreg(regresssor = RandomForestRegressor(random_state=123),lags=6)
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
plt.show()
