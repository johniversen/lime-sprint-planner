def get_solution_improvement_query():
    return {
        'limetype': 'solutionimprovement',
        'responseFormat': {
            'object': {
                'title': {
                    '_alias': 'name'
                },
                'priority': None,
                'coworkercreatedby': None,
                'card': None,
                'misc': None,
                'comment': None,
                'solutionimprovementstatus': None,
                'coworker': None,
            }
        }, 'orderBy': [
            {'title': 'ASC'},
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