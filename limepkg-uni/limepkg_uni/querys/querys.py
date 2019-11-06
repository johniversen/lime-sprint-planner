def get_query(limetype, config):
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
        jsonrequest['responseFormat']['object'][val] = {'_alias': key}
        
    return jsonrequest
