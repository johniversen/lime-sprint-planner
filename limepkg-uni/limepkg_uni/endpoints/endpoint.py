import lime_webserver.webserver as webserver
import logging
import webargs.fields as fields
from webargs.flaskparser import use_args
from ..endpoints import api
import lime_query
from ..querys import querys
from limepkg_uni.config import RuntimeConfig

logger = logging.getLogger(__name__)


class LimeobjectCounter(webserver.LimeResource):
    """Summarize your resource's functionality here"""

    # This describes the schema for the payload when posting a new deal
    # See https://webargs.readthedocs.io/en/latest/ for more info.
    args = {
        "limetype": fields.String(required=True)
    }

    @use_args(args)
    def get(self, args):
        """Get the current number of objects of the given type in the system.
        """
        rtcfg = RuntimeConfig()
        app = self.application
        rtcfg.application = app
        config = rtcfg.get_config()

        limetype = args['limetype']
        query = querys.get_query(limetype, config)

        limeapp = self.application
        response = lime_query.execute_query(
            query, limeapp.database.connection,
            limeapp.limetypes, limeapp.acl, limeapp.user
        )

        # TODO: Handle priority here? add prio nr based on limetype from config...?

        return response


api.add_resource(LimeobjectCounter, '/test/')
