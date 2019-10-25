"""
GraphQL schema for extracting results from a website.
"""

from collections import defaultdict
from html import escape

from extraction import DictExtractor as Extractor
from extraction.techniques import Technique
import graphene
import requests

from bripy.bllb.bllb_parsers import HTML_Parser
from bripy.ubrl.ubrl import URL

class TextExtractorTechnique(Technique):
    def extract(self, html):
        text = HTML_Parser.text_from_html(html)
        return {'text': [escape(text)]}

Extractor.techniques.append(TextExtractorTechnique)

def extract(url):
    r = requests.get(url)
    html = r.text
    extracted = Extractor().extract(html, source_url=url)
    u = URL(url)
    qs = u.get_qs
    extracted.update({'qs': qs.items()})
    return extracted

class Website(graphene.ObjectType):
    url = graphene.String(required=True)
    title = graphene.List(graphene.String)
    description = graphene.List(graphene.String)
    image = graphene.List(graphene.String)
    feed = graphene.List(graphene.String)
    text = graphene.List(graphene.String)
    qs = graphene.List(graphene.List(graphene.String))

    
class Query(graphene.ObjectType):
    website = graphene.Field(Website, url=graphene.String())

    def resolve_website(self, info, url):
        extracted = defaultdict(list, extract(url))
        return Website(url=url,
                       title=extracted['titles'],
                       description=extracted['descriptions'],
                       image=extracted['images'],
                       feed=extracted['feeds'],
                       text=extracted['text'],
                       qs=extracted['qs'],
        )

schema = graphene.Schema(query=Query)
