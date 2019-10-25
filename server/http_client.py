import requests
import json
from pprint import pprint

from constants import CONSTANTS
from query import make_query

q = make_query("https://google.com", "url,title")
resp = requests.post(f"http://localhost:3000/graphql", params={'query': q})
pprint(resp.content)
obj = json.loads(resp.text)
pprint(obj)
