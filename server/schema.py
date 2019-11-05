"""
GraphQL schema for extracting results from a website.
"""

from collections import defaultdict
from html import escape
from urllib.parse import urljoin

from boltons import urlutils
from bs4 import BeautifulSoup
from extraction import DictExtractor as Extractor
from extraction.techniques import Technique
import graphene
import requests
import spacy
from textblob import TextBlob

from bripy.bllb.bllb_logging import logger, DBG
from bripy.bllb.bllb_nlp import get_sumy
from bripy.bllb.bllb_parsers import HTML_Parser
from bripy.ubrl.ubrl import URL

from pagefunc import pagehtml, pagetext, get_links

nlp = None

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


class URLInterface(graphene.Interface):
    url = graphene.String(required=True)
    qs = graphene.List(graphene.List(graphene.String))
    ext = graphene.String()
    domain = graphene.String()
    tld = graphene.String()
    check = graphene.Boolean()
    qp = graphene.List(graphene.List(graphene.String))


class PageContent(graphene.Interface):
    html = graphene.String()
    text = graphene.String()


class Website(graphene.ObjectType):
    """Information extracted from a website."""
    class Meta:
        interfaces = (URLInterface,)

    title = graphene.List(graphene.String)
    description = graphene.List(graphene.String)
    image = graphene.List(graphene.String)
    feed = graphene.List(graphene.String)
    text = graphene.List(graphene.String)
    qs = graphene.List(graphene.List(graphene.String))


class Links(graphene.ObjectType):
    """Links extracted from a website."""
    class Meta:
        interfaces = (URLInterface,)

    links = graphene.List(graphene.List(graphene.String))
    
    def resolve_links(self, info):
        html = pagehtml(self.url)
        soup = BeautifulSoup(html, 'lxml')
        links = get_links(self.url, soup)
        links = [[link['Text'], link['Url']] for link in links]
        return links


class URL_Class(graphene.ObjectType):
    """Information from parsed URL."""
    class Meta:
        interfaces = (URLInterface,)


class TextInfo(graphene.ObjectType):
    """Information extracted from website text."""
    class Meta:
        interfaces = (PageContent,URLInterface,)

    links = graphene.List(graphene.String)
    polarity = graphene.Float()
    subjectivity = graphene.Float()
    summary = graphene.String()
    summary_polarity = graphene.Float()
    summary_subjectivity = graphene.Float()

    def resolve_links(self, info):
        for link in urlutils.find_all_links(self.text):
            DBG(f'Found link: {link}')
            yield link

    def resolve_polarity(self, info):
        DBG("Resolving polarity.")
        blob = TextBlob(self.text)
        return blob.sentiment.polarity

    def resolve_subjectivity(self, info):
        DBG("Resolving subjectivity.")
        blob = TextBlob(self.text)
        return blob.sentiment.subjectivity

    def resolve_summary(self, info):
        DBG("Resolving summary.")
        html = pagehtml(self.url)
        summary = get_sumy(3, html, self.url)
        return summary

    def resolve_summary_polarity(self, info):
        DBG("resolve_summary_polarity")
        html = pagehtml(self.url)
        summary = get_sumy(3, html, self.url)
        blob = TextBlob(summary)
        return blob.sentiment.polarity

    def resolve_summary_subjectivity(self, info):
        DBG("resolve_summary_subjectivity")
        html = pagehtml(self.url)
        summary = get_sumy(3, html, self.url)
        blob = TextBlob(summary)
        return blob.sentiment.subjectivity


class NLPInfo(graphene.ObjectType):
    """Natural language processing of website text."""
    class Meta:
        interfaces = (PageContent,URLInterface,)

    objects = graphene.List(graphene.String)


class Query(graphene.ObjectType):
    website = graphene.Field(Website, url=graphene.String())
    url_query = graphene.Field(URL_Class, url=graphene.String())
    text_info = graphene.Field(TextInfo, url=graphene.String())
    nlp_info = graphene.Field(NLPInfo, url=graphene.String())
    links = graphene.Field(Links, url=graphene.String())

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

    def resolve_url_query(self, info, url):
        u = URL(url)
        qs = [u.get_qs.items()]
        return URL_Class(
            url=url,
            qs=qs,
            ext=u.ext,
            domain=u.domain,
            tld=u.tld,
            check=u.check(),
            qp=u.query_params.items(),
            )

    def resolve_text_info(self, info, url):
        text = pagetext(url)
        return TextInfo(
            url=url,
            text=escape(text),
        )

    def resolve_nlp_info(self, info, url):
        text = pagetext(url)
        global nlp
        if not nlp:
            logger.info("Loading NLP model.")
            nlp = spacy.load("en_core_web_lg")
            DBG("Done loading NLP model.")
        doc = nlp(text)
        objects = {entity.text.strip(): entity.label_ for entity in doc.ents}
        return NLPInfo(
            url=url,
            text=escape(text),
            objects=objects.items(),
        )

    def resolve_links(self, info, url):
        return Links(
            url=url,
        )


schema = graphene.Schema(query=Query)
