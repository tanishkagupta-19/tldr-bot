import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
HEADERS={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
def scrape_times_of_india():
    url="https://timesofindia.indiatimes.com"
    try:
        response=requests.get(url,headers=HEADERS)
        if response.status_code!=200:
            return[]
        soup=BeautifulSoup(response.content,'html.parser')
        articles=[]
        for item in soup.find_all('figcaption'):
            title=item.get_text().strip().replace('\n',' ').replace('\r','')
            parent_link=item.find_parent('a')
            if parent_link:
                link=parent_link['href']
                link=urljoin(url,link)
                if title and link and 'articleshow' in link:
                    articles.append({'source':'Times of India','title':title,'link':link})
        return articles[:7]
    except Exception:
        return[]
def scrape_article_content(url):
    try:
        response=requests.get(url,headers=HEADERS)
        if response.status_code!=200:
            return""
        soup=BeautifulSoup(response.content,'html.parser')
        content_div=soup.find('div',class_='_s30J')
        if not content_div:
            content_div=soup.find('div',class_='js_tbl_article')
        if not content_div:
            content_div=soup.find('div',class_='_3YYSt')
        if not content_div:
             content_div=soup.find('div',{'data-articlebody':True})
        if content_div:
            paragraphs=content_div.find_all('p')
            if paragraphs:
                article_text=" ".join([p.get_text().strip() for p in paragraphs])
            else:
                article_text=content_div.get_text(separator=' ',strip=True)
        else:
            paragraphs=soup.find_all('p')
            article_text=" ".join([p.get_text().strip() for p in paragraphs if len(p.get_text().strip())>50])
        return article_text
    except Exception:
        return""
if __name__=="__main__":
    toi_news=scrape_times_of_india()
    for news in toi_news:
        print(f"[{news['source']}] {news['title']} - {news['link']}")