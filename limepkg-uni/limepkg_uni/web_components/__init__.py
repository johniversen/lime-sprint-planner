from os.path import realpath, dirname, join, exists
import logging
import json
import pkg_resources


logger = logging.getLogger(__name__)


def _get_static_path():
    root_path = realpath(dirname(__file__))
    static = join(root_path, 'static')
    dist = join(root_path, '..', '..', 'frontend', 'dist')
    return static if exists(static) else dist


def register_web_components():
    '''
    This function returns a list of config objects of all web-components
    in this plugin. Each config object contains the name of the component
    and the slot it belongs to:
    '''
    static_path = _get_static_path()
    filepath = join(static_path, 'lwc.config.json')
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

    return []


def register_static_content():
    '''
    Returns a list with a tuple consisting of the route-name for web-components
    served by this plugin and the path to the dist folder for all
    web-components:

        (lwc-components, path_to_static_content_for_components).
    '''

    def _get_plugin_version():
        package_name = __name__.split('.')[0]
        req = pkg_resources.Requirement.parse(package_name)
        working_set = pkg_resources.WorkingSet()
        dist = working_set.find(req)
        return dist.version if dist else None

    version = _get_plugin_version()
    static_path = _get_static_path()

    route_name = ('lwc-components' if version is None else
                  'lwc-components-{}'.format(version))

    return [(route_name, static_path)]
