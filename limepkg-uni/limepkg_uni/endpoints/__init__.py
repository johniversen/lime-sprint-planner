import flask_marshmallow
import importlib
import lime_endpoints
import lime_endpoints.endpoints
from lime_endpoints.factory import Api
import logging
import pkgutil

URL_PREFIX = '/limepkg-uni'

logger = logging.getLogger(__name__)

bp = lime_endpoints.endpoints.create_blueprint(
    'limepkg_uni',
    __name__,
    URL_PREFIX)
api = Api(bp)
ma = flask_marshmallow.Marshmallow(bp)


def register_blueprint(app, config=None):
    for loader, module_name, is_pkg in pkgutil.walk_packages(__path__):
        if module_name.endswith('_test'):
            continue
        module_fullname = '{}.{}'.format(__name__, module_name)
        logger.info('Loading {}'.format(module_fullname))
        importlib.import_module(module_fullname)

    app.register_blueprint(bp)
    return bp
