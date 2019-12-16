import lime_webserver.webserver as webserver
import logging
import webargs.fields as fields
from webargs.flaskparser import use_args
from ..endpoints import api
import lime_query
from limepkg_uni.config import RuntimeConfig
import datetime
import pprint

logger = logging.getLogger(__name__)

class LimeobjectsRetriever(webserver.LimeResource):
    '''Returns a list of lime objects from the db, formatted according to config'''

    # This describes the schema for the payload when posting a new deal
    # See https://webargs.readthedocs.io/en/latest/ for more info.
    args = {
        'limetype': fields.String(required=False),
        'chosenDate': fields.String(required=False)
    }

    @use_args(args)
    def get(self, args):
        limetype = args['limetype']
        chosenDate = args['chosenDate'] if 'chosenDate' in args else None
        response = self.create_response(limetype, chosenDate)
        return response

    def create_response(self, limetype, chosenDate):
        # Get config
        config = self.get_config()

        # Get limetype that we wish to display from args
        query = self.create_query(limetype, chosenDate, config)
        print(' ')
        print('query:')
        print(query)

        # Query the db and fill a json with data formatted by config
        response = self.query_db(query)
        print(' ')
        print('response from db query:')
        print(response)

        # Adds priority info and formats date info
        response = self.format_response(response, config, limetype)
        print(' ')
        print('formatted response sent to frontend:')
        print(response)
        
        return response

    def get_config(self):
        rtcfg = RuntimeConfig()
        app = self.application
        rtcfg.application = app
        config = rtcfg.get_config()
        return config

    def create_query(self, limetype, chosenDate, config):
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
            if (key == 'Responsible'):
                jsonrequest['responseFormat']['object'][val] = {'name': None}
            elif (key != 'PriorityHierarchy' and key != 'DisplayName'):
                if isinstance(val, dict):
                    for innerkey, innerval in val.items():
                       jsonrequest['responseFormat']['object'][innerval] = {'_alias': innerkey} 
                else:
                    jsonrequest['responseFormat']['object'][val] = {'_alias': key} 

        # Add ID 
        jsonrequest['responseFormat']['object']['id'] = {'_alias': 'postId'}

        # Add week filter (if applicable)
        if (chosenDate != None and 'Date Deadline' in config['limetypes'][limetype]['Optional']):
            # Create date obj from string
            chosenDateObj = datetime.datetime.strptime(chosenDate, '%d-%m-%Y')
            
            # Create two objects representing beginning and end of the week. 
            beginningOfChosenWeek = chosenDateObj - datetime.timedelta(days=-chosenDateObj.weekday()) 
            endOfChosenWeek = beginningOfChosenWeek + datetime.timedelta(days=5)

            # Add a filter to the request, only retrieve objects with date_done within the chosen week.
            jsonrequest['filter'] = {
                'op': 'AND',
                'exp': [
                    {
                        'key': config['limetypes'][limetype]['Optional']['Date Deadline'],
                        'op': '<=',
                        'exp': endOfChosenWeek
                    },
                    {
                        'key': config['limetypes'][limetype]['Optional']['Date Deadline'],
                        'op' : '>=',
                        'exp': beginningOfChosenWeek
                    }
                ]
            }

        pp = pprint.PrettyPrinter(indent=2)
        pp.pprint(jsonrequest)
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
        return response

    def format_response(self, response, config, limetype):
        pp = pprint.PrettyPrinter(indent=2)
        print(' ')
        print('response before format:')
        pp.pprint(response)
        newResponse = {}
        newResponse['objects'] = []

        for obj in response['objects']:
            newObj = {}
            # Add priority
            status = obj['PriorityVariable']
            newObj['priorityValue'] = config['limetypes'][limetype]['PriorityHierarchy'][status]
            newObj['postId'] = obj['postId']

            pp.pprint(obj)

            pp.pprint(config['limetypes'][limetype].items())
            # Restructure response to reflect config
            for key, val in config['limetypes'][limetype].items():
                if key == 'DisplayName' or key == 'PriorityHierarchy' or key == 'PriorityVariable':
                    continue

                # If nested 
                if isinstance(val, dict): 
                    pp.pprint(val)
                    newObj[key] = {}
                    for innerkey, innerval in val.items():
                        pp.pprint(innerval)
                        # If date, format the date
                        if innerkey.startswith('Date ') and obj[innerkey] != None:
                            if innerkey in obj: newObj[key][innerkey] = obj[innerkey].strftime('%d-%m-%Y')
                        else:
                            if innerkey in obj: newObj[key][innerkey] = obj[innerkey] 
                # If not nested 
                else:
                    pp.pprint(val)
                    # If date, format the date
                    if key.startswith('Date ') and obj[key] != None:
                        if key in obj: newObj[key] = obj[key].strftime('%d-%m-%Y')
                    else:
                        if key in obj: newObj[key] = obj[key]

            newResponse['objects'].append(newObj)

        pp.pprint(newResponse)
        return newResponse

api.add_resource(LimeobjectsRetriever, '/')
