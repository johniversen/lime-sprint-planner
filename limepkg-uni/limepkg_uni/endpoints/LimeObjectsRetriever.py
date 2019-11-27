import lime_webserver.webserver as webserver
import logging
import webargs.fields as fields
from webargs.flaskparser import use_args
from ..endpoints import api
import lime_query
from limepkg_uni.config import RuntimeConfig

logger = logging.getLogger(__name__)

class LimeobjectsRetriever(webserver.LimeResource):
    """Returns a list of lime objects from the db, formatted according to config"""

    # This describes the schema for the payload when posting a new deal
    # See https://webargs.readthedocs.io/en/latest/ for more info.
    args = {
        "limetype": fields.String(required=False)
    }

    @use_args(args)
    def get(self, args):
        limetype = args['limetype']
        response = self.create_response(limetype)
        return response

    def create_response(self, limetype):
        # Get config
        config = self.get_config()

        # Get limetype that we wish to display from args
        query = self.create_query(limetype, config)

        # Query the db and fill a json with data formatted by config
        response = self.query_db(query)

        # Adds priority info and formats date info
        response = self.format_response(response, config, limetype)
        
        return response

    def get_config(self):
        rtcfg = RuntimeConfig()
        app = self.application
        rtcfg.application = app
        config = rtcfg.get_config()
        return config

    def create_query(self, limetype, config):
        # Build skeleton for database request
        jsonrequest = {
            'limetype': limetype,
            'responseFormat': {
                'object': {

                }
            }
        }
        # Fill json with info from the config
        for key, val in config['limetypes'][limetype].items():
            if (key != "prio" and key != "displayName") :
                jsonrequest['responseFormat']['object'][val] = {'_alias': key}

        # Add ID 
        jsonrequest['responseFormat']['object']['id'] = {'_alias': 'postId'}
        return jsonrequest

    def query_db(self, query):
        limeapp = self.application
        response = lime_query.execute_query(
            query, 
            limeapp.database.connection,
            limeapp.limetypes, 
            limeapp.acl, 
            limeapp.user
        )
        print(response)
        return response

    def format_response(self, response, config, limetype):
        for obj in response['objects']:
            # Add priority
            status = obj['status']
            obj['priorityValue'] = config['limetypes'][limetype]['prio'][status]
            for key, val in obj.items():
                # Format dateobjects
                if key.startswith('date_'):
                    date_str = val.strftime("%d/%m/%Y")
                    obj[key] = date_str


        return response

api.add_resource(LimeobjectsRetriever, '/test/')
