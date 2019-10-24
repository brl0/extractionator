#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Main module."""

import json
import sys
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from flask import render_template
import pandas as pd
import requests

from bripy.bllb.bllb_parsers import HTML_Parser
from bripy.bllb.bllb_logging import DBG, logger


def pagehtml(url: str) -> str:
    try:
        r = requests.get(url)
    except Exception as error:
        logger.warning(
            f'\nException processing url.\nURL: {url}\nError: {error}\n')
        return ''
    else:
        return r.content


def pagetext(url: str) -> str:
    return HTML_Parser.all_text(pagehtml(url))


def get_status(r) -> dict:
    return {
        "code": r.status_code,
        "ok": r.ok,
        "reason": r.reason,
        "description": requests.status_codes._codes[r.status_code][0],
        "aliases": requests.status_codes._codes[r.status_code],
        "is_redirect": r.is_redirect,
        "is_permanent_redirect": r.is_permanent_redirect
    }


def get_headers(r) -> str:
    headers = dict(r.headers)
    headers = json.dumps(headers, indent=4, sort_keys=True)
    return headers


def json_table(name, data):
    d = json.loads(data)
    df = pd.DataFrame.from_dict(d, orient='index')
    table = df.to_html(table_id=name)
    tables = []
    tables.append({"name": name, "table": table})
    html = render_template('table.html', tables=tables)
    return html


def get_info(r) -> dict:
    info = {
        "status_code": r.status_code,
        "ok": r.ok,
        "reason": r.reason,
        "description": requests.status_codes._codes[r.status_code][0],
        "status_aliases":
        ','.join(requests.status_codes._codes[r.status_code]),
        "is_redirect": r.is_redirect,
        "is_permanent_redirect": r.is_permanent_redirect,
        "apparent_encoding": r.apparent_encoding,
        "encoding": r.encoding,
        "elapsed": r.elapsed,
        "history": r.history,
        "cookies": r.cookies,
    }
    return info


def get_links(url: str, soup: BeautifulSoup) -> list:
    links = [{
        "Index": index,
        "Text": link.get_text(),
        "Url": urljoin(url, link.get('href'))
    } for index, link in enumerate(soup.find_all('a', href=True))]
    return links


def get_all(url: str) -> dict:
    try:
        result = {"url": url}
        r = requests.get(url)
    except Exception as error:
        result.update({"title": "Exception"})
        result.update({"text": error})
        logger.warning(
            f'Exception processing url.\nURL: {url}\nError: {error}')
    else:
        result.update({"status": get_status(r)})
        result.update({"headers": get_headers(r)})
        result.update({"info": get_info(r)})
        soup = BeautifulSoup(r.content, 'lxml')
        result.update({"title": soup.title.string})
        result.update({"text": HTML_Parser.all_text(soup)})
    return result


def start(urls: list) -> None:
    assert urls is not None and len(urls)
    DBG(f'start\nurls: {urls}')
    for url in urls:
        text = pagetext(url)
        print(url)
        print(text)
    return


if __name__ == '__main__':
    from cli import main
    sys.exit(main())  # pragma: no cover
