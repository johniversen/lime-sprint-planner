import os.path


def register_translations():
    '''
    Returns the path to the directory containing po-files.
    '''
    return os.path.abspath(os.path.dirname(__file__))
