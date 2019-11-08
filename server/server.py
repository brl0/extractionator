"""
Python HTTP server for GraphQL.
"""

import json
from os.path import exists, join
import sys

from flask import (
    Flask, jsonify, make_response, render_template, request,
    send_from_directory, url_for)
from flask_cors import CORS
from flask_graphql import GraphQLView
from textblob import TextBlob

from bripy.bllb.bllb_logging import setup_logging, get_dbg

from constants import CONSTANTS
from pagefunc import *
from sample_data import sample_data
from schema import extract, schema
from query import query_url


LOG_LEVEL = "DEBUG"

logger = setup_logging(LOG_LEVEL)
DBG = get_dbg(logger)

application = Flask(__name__, static_folder='build')
CORS(application)


@application.route(CONSTANTS['ENDPOINT']['JSON'])
def get_json():
    logger.debug(f'{request}')
    url = request.args.get('url')
    parts = request.args.get('parts')
    if not parts:
        parts = "url,title,feed,image,description,text"
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
# application.add_url_rule('/graphql/batch', view_func=GraphQLView.as_view('graphql', schema=schema, batch=True))


def register_blueprints():
    from views import page_views
    from views import list_views

    application.register_blueprint(page_views.application)
    application.register_blueprint(list_views.application)

def main():
    register_blueprints()
    application.config.from_object('configurations.DevelopmentConfig')
    application.run(port=CONSTANTS['PORT'], host='0.0.0.0')


if __name__ == '__main__':
    sys.exit(main())
