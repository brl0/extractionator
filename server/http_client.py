import requests
import json
from pprint import pprint

from constants import CONSTANTS
from query import make_query

q = make_query("https://lethain.com/migrations", "url, title, image, description")
resp = requests.post(f"http://{CONSTANTS['HOSTNAME']}:{CONSTANTS['PORT']}/", params={'query': q})
obj = json.loads(resp.text)
pprint(obj)
