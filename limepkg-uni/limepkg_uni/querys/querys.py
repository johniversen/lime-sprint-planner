def get_query(limetype, config):
    return {
        'limetype': limetype,
        'responseFormat': {
            'object': {
                config['limetypes'][limetype]['title']: None,
                # 'title': {
                #     '_alias': 'name'
                # },
                config['limetypes'][limetype]['priority']: None,
                config['limetypes'][limetype]['misc']: None,
                config['limetypes'][limetype]['comment']: None,
                config['limetypes'][limetype]['status']: {
                    '_alias': 'status'
                },
            }
        }, 'orderBy': [
            {config['limetypes'][limetype]['status']: 'ASC'},
            {'priority': 'DESC'},
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