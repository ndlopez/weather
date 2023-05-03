#extracting data from www.timeanddate.com
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.error import HTTPError

year = "2023"
monty = "5"

my_url='https://www.timeanddate.com/moon/japan/nagoya?month=' + \
    monty + '&year=' + year

#when downloading a page...
try:
    source=urlopen(my_url)
    print("Access granted")
except HTTPError as err:
    print("Access denied or...", err.code)
    print("Better use curl to fetch the page...")
    source = open('../data/23108_3hr.html','r')

soup = BeautifulSoup(source.read(),'html.parser')

def get_info(tab_id):
    tables = soup.find('table',id=tab_id)
    tab_tr = tables.find_all('tr')
    
    for item in tab_tr:
        tab_th = item.find('th')
        tab_td = item.find_all(class_='sep') #pdr0
        if tab_th is not None:
            print(year,monty,"-",tab_th.string,end=',')
            for idx in range(len(tab_td)):
                val_ery = tab_td[idx].string
                if tab_td[0].string == "-":
                    # tab_td[0] = 
                    val_ery = tab_td[2].string
                print(val_ery,end=',')
            """for td_item in tab_td:
                print(td_item.string,end=',')"""
            print()

get_info("tb-7dmn")
