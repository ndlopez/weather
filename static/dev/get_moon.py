#!/usr/bin/python3
# Moon Rise/Set times, distance to Earth, % illumination
# extracting data from www.timeanddate.com
# 
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.error import HTTPError

year = "2023"
monty = "7"
location = "nagoya"

my_url='https://www.timeanddate.com/moon/japan/'+ location + '?month=' + \
    monty + '&year=' + year

try:
    #when downloading a page...
    source=urlopen(my_url)
    print("Access granted")
except HTTPError as err:
    print("Access denied or...", err.code)
    print("Better use curl to fetch the page...")
    source = open('../../../MoonTimes.html','r')

soup = BeautifulSoup(source.read(),'html.parser')

def get_info(tab_id):
    tables = soup.find('table',id=tab_id)
    tab_tr = tables.find_all('tr')
    jdx=0
    for item in tab_tr:
        tab_th = item.find('th')
        tab_td = item.find_all(class_='sep') #pdr0
        if tab_th is not None and jdx > 0:
            aux = tab_th.string
            if aux is None:
                aux = jdx - 1
            print(f"{year}-0{monty}-{aux}",end=';')
            for idx in range(len(tab_td)):
                if tab_td[idx].string == "-":
                    val_ery = tab_td[0].string
                else:
                    val_ery = tab_td[idx].string
                print(val_ery,end=';')
            """for td_item in tab_td:
                print(td_item.string,end=',')"""
            print()
        jdx += 1

get_info("tb-7dmn")
