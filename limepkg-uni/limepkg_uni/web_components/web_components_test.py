from .. import web_components


def test_get_static_path():
    path = web_components._get_static_path()
    assert path.endswith('dist') or path.endswith('static')
