import requests
from pprint import pprint

query = {b"url=https://github.com/shirosaidev/stocksight"}

r = requests.post('http://localhost:3001//spacy_info', data=query)

pprint(r.content)
