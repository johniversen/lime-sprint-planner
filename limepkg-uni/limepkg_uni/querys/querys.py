def get_query(limetype, config):
    return {
        'limetype': limetype,
        'responseFormat': {
            'object': {
                config['limetypes'][limetype]['title']: {
                    '_alias': 'title'
                },
                config['limetypes'][limetype]['priority']: {
                    '_alias': 'priority'
                },
                config['limetypes'][limetype]['misc']: {
                    '_alias': 'misc'
                },
                config['limetypes'][limetype]['comment']: {
                    '_alias': 'comment'
                },
                config['limetypes'][limetype]['status']: {
                    '_alias': 'status'
                },
            }
        }, 'orderBy': [
            {config['limetypes'][limetype]['status']: 'ASC'},
        ]
    }


def get_deal_query():
    return {
        'limetype': 'deal',
        'responseFormat': {
            'object': {
                'name': None,
                'company': None,
                'person': None,
                'coworker': None,
                'dealstatus': {
                    '_alias': 'priority'
                },
                'value': {
                    '_alias': 'misc'
                },
                'probability': None
            }
        }, 'orderBy': [
            {'company': 'ASC'}
        ]
    }


def get_company_query():
    return {
        'limetype': 'company',
        'responseFormat': {
            'object': {
                'name': None,
                'buyingstatus': {
                    '_alias': 'priority'
                },
                'coworker': None,
                'postaladdress1': None,
                'visitingaddress1': None,
                'postalzipcode': None,
                'postalcity': {
                    '_alias': 'misc'
                },
                'visitingzipcode': None,
                'visitingcity': None,
                'country': None,
                'phone': None,
            }
        }, 'orderby': [
            {'name': 'ASC'},
            {'coutry': 'DESC'}
        ]
    }