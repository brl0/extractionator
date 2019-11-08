import json

from flask import (Blueprint, jsonify, render_template, url_for)
from textblob import TextBlob

from pagefunc import *
from schema import extract


application = Blueprint('pagefunc', __name__, template_folder='templates')


@application.route('/extract_page/<path:url>', methods=['GET', 'POST'])
def extract_page(url):
    extracted = extract(url)
    return f"{url}\n\n{extracted['titles']}\n\n{extracted['descriptions']}"


@application.route('/get_page/<path:url>', methods=['GET', 'POST'])
def get_page(url):
    tables = []
    tables.append(page_links(url))
    tables.append(page_info(url))
    css = url_for('static', filename='style.css')
    result = get_all(url)
    headers = result['headers']
    print(type(headers))
    tables.append(json_table('Headers', headers))
    html = render_template('template.html',
                           css=css,
                           result=result,
                           tables=tables)
    return html


@application.route('/json_page/<path:url>', methods=['GET', 'POST'])
def json_page(url):
    result = get_all(url)
    logger.debug(type(result))
    safe = dict()
    for key, value in result.items():
        try:
            json.dumps({key: value})
        except Exception as error:
            logger.warning(f"Error dumping {key} to JSON.\n"
                           f"Value: {value}\n"
                           f"Error: {error}")
        else:
            safe.update({key: value})
    return json.dumps(safe)


@application.route('/page_links/<path:url>', methods=['GET', 'POST'])
def page_links(url):
    html = pagehtml(url)
    soup = BeautifulSoup(html, 'lxml')
    links = get_links(url, soup)
    links_df = pd.DataFrame.from_dict(links)
    links_df.set_index("Index")
    links_html = links_df.to_html(table_id='Links', index=False)
    tables = []
    tables.append({"name": "Links", "table": links_html})
    output = render_template('table.html', tables=tables)
    return output


@application.route('/json_links/<path:url>', methods=['GET', 'POST'])
def json_links(url):
    html = pagehtml(url)
    soup = BeautifulSoup(html, 'lxml')
    links = get_links(url, soup)
    return jsonify(links)


@application.route('/page_info/<path:url>', methods=['GET', 'POST'])
def page_info(url):
    try:
        r = requests.get(url)
    except Exception as error:
        logger.warning(
            f'Exception processing url.\nURL: {url}\nError: {error}')
        return ''
    else:
        result = get_info(r)
        df = pd.DataFrame.from_dict(result, orient='index', columns=['Value'])
        df.index.name = 'Field'
        df = df.reset_index()
        df.index.name = 'Index'
        table_html = df.to_html(table_id='Info')
        tables = []
        tables.append({"name": "Info", "table": table_html})
        html = render_template('table.html', tables=tables)
        j = json.loads(df.to_json(orient='split'))
        j = j['data']
        j = dict(j)
        j = json.dumps(j, indent=4, sort_keys=False)
        return html


@application.route('/text_info/<path:url>', methods=['GET', 'POST'])
def text_info(url):
    text = pagetext(url)
    blob = TextBlob(text)
    return json.dumps([str(word) for word in blob.noun_phrases])
