import os
import urllib2
from bs4 import BeautifulSoup
try:
    # Python 3.x
    from urllib.request import urlopen, urlretrieve, quote
    from urllib.parse import urljoin
except ImportError:
    # Python 2.x
    from urllib import urlopen, urlretrieve, quote
    from urlparse import urljoin

slides_folder = "SlidesT3chFest2017/"
root_url = 'https://t3chfest.uc3m.es'
year = "/2017"
agenda_url = root_url + year + '/programa'
u = urlopen(agenda_url)
try:
    html = u.read().decode('utf-8')
finally:
    u.close()
soup = BeautifulSoup(html, "html.parser")
if os.path.isdir(slides_folder) is False:
    os.mkdir(slides_folder)
for i in range(1,5):
    print("TRACK " + str(i) + ":")
    for presentation in soup.select('.track' + str(i)):
        if presentation.get('href') != None :
            presentation_url = root_url + year + str(presentation.get('href'))
            u2 = urlopen(presentation_url)
            try:
                html2 = u2.read().decode('utf-8')
            finally:
                u2.close()
            soup2 = BeautifulSoup(html2, "html.parser")
            for slidesButton in soup2.select('.button'):
                slidesUrl = root_url + str(slidesButton.get('href'))
                filename = slidesUrl.rsplit('/', 1)[-1]
                try:
                    urlretrieve(slidesUrl, slides_folder + filename)
                    print(filename)
                except:
                    print('failed to dowloading ' + filename)