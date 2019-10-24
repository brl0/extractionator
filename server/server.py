"""
Python HTTP server for GraphQL.
"""
from os.path import exists, join

from flask import (
    Flask, jsonify, make_response, render_template, request,
    send_from_directory, url_for)
from flask_graphql import GraphQLView

from constants import CONSTANTS
from data_table import data_table
from pagefunc import *
from sample_data import sample_data
from schema import extract, schema
from query import query_url

from bripy.bllb.bllb_logging import setup_logging

LOG_LEVEL = "DEBUG"

logger = setup_logging(LOG_LEVEL)

application = Flask(__name__, static_folder='build')


@application.route('/extract_page/<path:url>', methods=['GET', 'POST'])
def extract_page(url):
    extracted = extract(url)
    return f"{url}\n{extracted.title}\n{extracted.description}"

@application.route('/sampletable')
@application.route('/api/sampletable')
def get_table():
    return data_table(sample_data['text_assets'], 'sampletable', 'id')


# List Endpoints
@application.route(CONSTANTS['ENDPOINT']['LIST'])
def get_list():
    return jsonify(sample_data['list_text_assets']['list_items'])


@application.route(CONSTANTS['ENDPOINT']['LIST'], methods=['POST'])
def add_list_item():
    data = request.get_json()
    list_item = {
        '_id': sample_data['list_text_assets']['list_id'],
        'text': data['text']
    }
    sample_data['list_text_assets']['list_items'].insert(0, list_item)
    sample_data['list_text_assets']['list_id'] += 1
    json_response = jsonify(list_item)
    return make_response(json_response,
                         CONSTANTS['HTTP_STATUS']['201_CREATED'])


@application.route(CONSTANTS['ENDPOINT']['LIST'] + '/<int:id>', methods=['DELETE'])
def delete_list_item(id):
    list_items_to_remove = [
        list_item
        for list_item in sample_data['list_text_assets']['list_items']
        if list_item['_id'] == id
    ]
    if not list_items_to_remove:
        json_response = jsonify(
            {'error': 'Could not find an item with the given id'})
        return make_response(json_response,
                             CONSTANTS['HTTP_STATUS']['404_NOT_FOUND'])
    if len(list_items_to_remove) > 1:
        json_response = jsonify(
            {'error': 'More than one list items found with the same id'})
        return make_response(
            json_response,
            CONSTANTS['HTTP_STATUS']['500_INTERNAL_SERVER_ERROR'])
    sample_data['list_text_assets']['list_items'] = [
        list_item
        for list_item in sample_data['list_text_assets']['list_items']
        if list_item['_id'] != id
    ]
    return jsonify({'_id': id, 'text': 'This comment was deleted'})


# MasterDetail Page Endpoint
@application.route(CONSTANTS['ENDPOINT']['MASTER_DETAIL'])
def get_master_detail():
    return jsonify(sample_data['text_assets'])


# Grid Page Endpoint
@application.route(CONSTANTS['ENDPOINT']['GRID'])
def get_grid():
    return jsonify(sample_data['text_assets'])


@application.route(CONSTANTS['ENDPOINT']['JSON'])
def get_json():
    logger.debug(f'{request}')
    url = request.args.get('url')
    parts = request.args.get('parts')
    if not parts:
        parts = "url, title, feed, image"  #, description, text"
    result = query_url(url, parts)
    logger.debug(result)
    result = jsonify(result)
    logger.debug(result)
    return result


# Catching all routes
# This route is used to serve all the routes in the frontend application after deployment.
@application.route('/', defaults={'path': ''})
@application.route('/<path:path>')
def catch_all(path):
    file_to_serve = path if path and exists(join(application.static_folder, path)) else 'index.html'
    return send_from_directory(application.static_folder, file_to_serve)

# Error Handler
@application.errorhandler(404)
def page_not_found(error):
    json_response = jsonify({'error': 'Page not found'})
    return make_response(json_response, 
                         CONSTANTS['HTTP_STATUS']['404_NOT_FOUND'])

application.add_url_rule('/graphql',
                 view_func=GraphQLView.as_view('graphql',
                                               schema=schema,
                                               graphiql=True))


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
    tables = []
    tables.append(page_links(url))
    tables.append(page_info(url))
    result = get_all(url)
    return result


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
        import json
        j = json.loads(df.to_json(orient='split'))
        from collections import OrderedDict
        j = j['data']
        j = dict(j)
        j = json.dumps(j, indent=4, sort_keys=False)
    return html


if __name__ == '__main__':
    application.config.from_object('configurations.DevelopmentConfig')
    application.run(port=CONSTANTS['PORT'], host='0.0.0.0')
