import lime_webserver.webserver as webserver
import logging
import webargs.fields as fields
from webargs.flaskparser import use_args
from ..endpoints import api
import lime_query
from limepkg_uni.config import RuntimeConfig

logger = logging.getLogger(__name__)

class LimetypesRetriever(webserver.LimeResource):
    """Returns a list of lime objects from the db, formatted according to config"""

    # This describes the schema for the payload when posting a new deal
    # See https://webargs.readthedocs.io/en/latest/ for more info.
    args = {    }

    @use_args(args)
    def get(self, args):
        # Get config
        config = self.get_config()
        response = {
            'limetypes': {}
         }

        # for obj in config['limetypes']:
            # response['limetypes'][obj.keys()[0]] = obj['displayName']
        for key, val in config['limetypes'].items():
            response['limetypes'][key] = config['limetypes'][key]['displayName']
            print(key)
            print(val)

        return response

    def get_config(self):
        rtcfg = RuntimeConfig()
        app = self.application
        rtcfg.application = app
        config = rtcfg.get_config()
        return config

api.add_resource(LimetypesRetriever, '/test/getlimetypes')
