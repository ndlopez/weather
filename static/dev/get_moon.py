#extracting data from www.tenki.jp
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.error import HTTPError

my_url='https://www.timeanddate.com/moon/japan/nagoya?month=5&year=2023'
class_list=["weather","temperature","prob-precip","precipitation",
            "humidity","wind-speed"]
#when downloading a page...
try:
    source=urlopen(my_url)
    print("Access granted")
except HTTPError as err:
    print("Access denied or...", err.code)
    print("Better use curl to fetch the page...")
    source = open('../data/23108_3hr.html','r')

soup = BeautifulSoup(source.read(),'html.parser')

'''
tab_tr=tables.find('tr',class_='weather')
print(tab_tr.get_text("\n",strip=True).replace("\n",","))
#out: '\n天気\n曇り\n曇り\n曇り\n曇り\n曇り\n曇り\n曇り\n曇り\n'
tab_tr=tables.find('tr',class_='temperature')
tab_tr=tables.find('tr',class_='prob-precip')
tab_tr=tables.find('tr',class_='precipitation')
tab_tr=tables.find('tr',class_='humidity')
tab_tr=tables.find('tr',class_='wind-speed')
'''
#up to here ok!
def get_info(tab_id):
    tables = soup.find('table',id=tab_id)
    # tab_body = tables.find_all('tbody')
    tab_tr = tables.find_all('tr')
    """for classy in class_list:
        tab_tr=tables.find('tr',class_=classy)
        print(tab_tr.get_text("\n",strip=True).replace("\n",","))"""
    for item in tab_tr:
        tab_th = item.find('th')
        tab_td = item.find_all(class_='sep') #pdr0
        if tab_th is not None:
            print(tab_th.string,end=',')
            for td_item in tab_td:
                print(td_item.string,end=',')
            print()

get_info("tb-7dmn")
# get_info("forecast-point-3h-tomorrow")

"""
<th rowspan="1" title="First Quarter at 0時22分"><img class="fl" height="11" src="//c.tadst.com/gfx/moon4.svg" title="First Quarter at 0時22分" width="11"/> 28</th> [<td class="pdr0 sep" title="The Moon sets in the West-northwest at 0時49分">0時49分</td>, <td class="pdr0 sep" title="The Moon rises in the East-northeast at 11時59分">11時59分</td>, <td class="pdr0 sep-l" title="The Moon crosses the local meridian at 18時41分 (63.8° above the horizon)">18時41分</td>]
<th rowspan="1">29</th> [<td class="pdr0 sep" title="The Moon sets in the West at 1時14分">1時14分</td>, <td class="pdr0 sep" title="The Moon rises in the East at 12時57分">12時57分</td>, <td class="pdr0 sep-l" title="The Moon crosses the local meridian at 19時22分 (58.1° above the horizon)">19時22分</td>]
<th rowspan="1">30</th> [<td class="pdr0 sep" title="The Moon sets in the West at 1時38分">1時38分</td>, <td class="pdr0 sep" title="The Moon rises in the East at 13時55分">13時55分</td>, <td class="pdr0 sep-l" title="The Moon crosses the local meridian at 20時03分 (52.0° above the horizon)">20時03分</td>]
<th rowspan="1">31</th> [<td class="pdr0 sep" title="The Moon sets in the West at 2時02分">2時02分</td>, <td class="pdr0 sep" title="The Moon rises in the East at 14時55分">14時55分</td>, <td class="pdr0 sep-l" title="The Moon crosses the local meridian at 20時45分 (45.9° above the horizon)">20時45分</td>]
"""