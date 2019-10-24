import requests
from pprint import pprint

query = {"query":"{website (url:\"https://google.com\") {url title}}"}

r = requests.post('http://localhost:3001/graphql?', data=query)

pprint(r.content)
