"""
GraphQL schema for extracting results from a website.
"""

from collections import defaultdict

from extraction import DictExtractor as Extractor
from extraction.techniques import Technique
import graphene
import requests

from bripy.bllb.bllb_parsers import HTML_Parser

class TextExtractorTechnique(Technique):
    def extract(self, html):
        text = HTML_Parser.text_from_html(html)
        return {'text': [text]}

Extractor.techniques.append(TextExtractorTechnique)

def extract(url):
    html = requests.get(url).text
    extracted = Extractor().extract(html, source_url=url)
    return extracted

class Website(graphene.ObjectType):
    url = graphene.String(required=True)
    title = graphene.String()
    description = graphene.String()
    image = graphene.String()
    feed = graphene.String()
    text = graphene.String()

    
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
        )

schema = graphene.Schema(query=Query)
