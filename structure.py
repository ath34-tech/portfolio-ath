import requests
from bs4 import BeautifulSoup

url = "https://www.codechef.com/users/me_rahulmaurya"
res = requests.get(url)
soup = BeautifulSoup(res.text, "html.parser")

rating = soup.find("div", class_="rating-number").text
stars = soup.find("span", class_="rating").text.strip()
print(f"Rating: {rating}, Stars: {stars}")
