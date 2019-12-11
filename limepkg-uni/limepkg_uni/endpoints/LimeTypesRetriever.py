import lime_webserver.webserver as webserver
import logging
import webargs.fields as fields
from webargs.flaskparser import use_args
from ..endpoints import api
import lime_query
from limepkg_uni.config import RuntimeConfig
import pprint

logger = logging.getLogger(__name__)

class LimetypesRetriever(webserver.LimeResource):
    '''Returns a list of lime objects from the db, formatted according to config'''

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

        for key, val in config['limetypes'].items():
            response['limetypes'][key] = {}
            response['limetypes'][key]['DisplayName'] = val['DisplayName']
            if 'PriorityVariable'  in val: response['limetypes'][key]['PriorityVariable'] = val['PriorityVariable']
            if 'PriorityHierarchy' in val: response['limetypes'][key]['PriorityHierarchy'] = val['PriorityHierarchy']
            if 'Optional' in val: 
                if 'Date Deadline' in val['Optional']: 
                    response['limetypes'][key]['Optional'] = {}
                    response['limetypes'][key]['Optional']['Date Deadline'] = val['Optional']['Date Deadline'] 

        pp = pprint.PrettyPrinter(indent=2)
        print(' ')
        print('response before format:')
        pp.pprint(response)
        print(' ')
        return response

    def get_config(self):
        rtcfg = RuntimeConfig()
        app = self.application
        rtcfg.application = app
        config = rtcfg.get_config()
        return config

api.add_resource(LimetypesRetriever, '/getlimetypes/')
