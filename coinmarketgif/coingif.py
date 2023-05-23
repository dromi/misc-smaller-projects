from datetime import datetime
from urllib.request import urlretrieve

from bs4 import BeautifulSoup
import imageio
import requests
import os

def play():
    url = 'https://coinmarketcap.com/'
    r = requests.get(url)
    html = r.text
    soup = BeautifulSoup(html, 'lxml')
    price_graphs = soup.find_all('tr', {'class': 'cmc-table-row'})
    for pg in price_graphs:
        print(pg)
    srcs = [pg['src'] for pg in price_graphs]



def gif():
    url = 'https://coinmarketcap.com/'
    r = requests.get(url)
    html = r.text
    soup = BeautifulSoup(html, 'lxml')
    price_graphs = soup.find_all('img', {'class': 'cmc-price-graph'})
    srcs = [pg['src'] for pg in price_graphs]
    for idx, pg in enumerate(price_graphs):
        img_src = pg['src']
        urlretrieve(img_src, f'{idx}.jpg')

    images = [imageio.imread(f'{idx}.jpg') for idx in range(len(price_graphs))]

    kargs = {'fps': 24}
    imageio.mimsave(f"coingif_{datetime.today().strftime('%Y-%m-%d')}.gif", images, 'GIF', **kargs)
    [os.remove(f'{idx}.jpg') for idx in range(len(price_graphs))]


if __name__ == '__main__':
    play()
