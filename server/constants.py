import os

CONSTANTS = {
    'HOSTNAME': 'localhost',
    'PORT': os.environ.get('PORT', 3001),
    'HTTP_STATUS': {
        '404_NOT_FOUND': 404,
        '201_CREATED': 201,
        '500_INTERNAL_SERVER_ERROR': 500
    },
    'ENDPOINT': {
        'LIST': '/api/list',
        'MASTER_DETAIL': '/api/masterdetail',
        'GRID': '/api/grid',
    }
}
