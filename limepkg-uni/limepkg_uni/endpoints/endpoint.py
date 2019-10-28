import lime_webserver.webserver as webserver
import logging
import webargs.fields as fields
from webargs.flaskparser import use_args
from ..endpoints import api
import lime_query
from ..querys import querys


logger = logging.getLogger(__name__)


class LimeobjectCounter(webserver.LimeResource):
    """Summarize your resource's functionality here"""

    # This describes the schema for the payload when posting a new deal
    # See https://webargs.readthedocs.io/en/latest/ for more info.
    args = {
        "limetype": fields.String(required=True),
        # "_filter": fields.String(required=False),
    }

    @use_args(args)
    def get(self, args):
        """Get the current number of objects of the given type in the system.
        """
        # limetype = self.application.limetypes.get_limetype(args['limetype'])
        # ALSHDASDSasdfgsdhgf
        # limeobjects = limetype.get_all()
        limetype = args['limetype']

        if(limetype == 'solutionimprovement'):
            query = querys.get_solution_improvement_query()
        elif(limetype == 'deal'):
            query = querys.get_deal_query()
        elif(limetype == 'company'):
            query = querys.get_company_query()

        limeapp = self.application
        response = lime_query.execute_query(
            query, limeapp.database.connection,
            limeapp.limetypes, limeapp.acl, limeapp.user
        )

        return response


api.add_resource(LimeobjectCounter, '/test/')
