import json

def get_query(limetype, config):
    # Build skeleton for database request
    jsonresponse = {
        'limetype': limetype,
        'responseFormat': {
            'object': {

            }
        }
    }
    
    # Fill json with info from the config
    for key, val in config['limetypes'][limetype].items():
        jsonresponse['responseFormat']['object'][val] = {'_alias': key}
        
    return jsonresponse
