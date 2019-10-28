#!/usr/bin/env python
from contextlib import contextmanager
import os.path
import shutil
import sys
import os
from subprocess import call, check_call, CalledProcessError
from os.path import abspath, dirname
import getpass
import logging
import click
import webbrowser


logger = logging.getLogger(__name__)
ROOT = os.path.abspath(os.path.dirname(__file__))


@click.group(context_settings={'help_option_names': ['--help', '-h']})
@click.option(
    '--loglevel', default='INFO',
    type=click.Choice(['CRITICAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG']))
def cli(loglevel):
    _setup_logger(loglevel)


@cli.group(help='Run tests', invoke_without_command=True)
@click.pass_context
def test(ctx):
    if ctx.invoked_subcommand is None:
        ctx.invoke(test_unit)
        ctx.invoke(flake)


@test.command(name='unit', help="Run unit tests")
def test_unit():
    ret = call(['py.test'])
    if ret > 0 and not ret == 5:
        raise Exception('Tests failed!')


@test.command(name='coverage', help="Run unit tests and get a coverage report")
@click.option('--browser/--no-browser', default=True)
def test_coverage(browser):
    rm('.coverage')
    rm_rf('.htmlcov')
    cmd = ['pytest',
           '--cov',
           '--cov-report', 'term',
           '--cov-report', 'html',
           '--cov-config=setup.cfg']
    check_call(cmd)
    if browser:
        browse_to('.htmlcov/index.html')


@test.command(help="Check for PEP8 violations")
def flake():
    check_call(['flake8', abspath(dirname(__file__))])


@cli.group(help='Documentation helpers')
def docs():
    pass


@docs.command(name='generate-mkdocs', help="Generate documentation")
def mkdocs_generate():
    _verify_mk_docs()
    check_call(['mkdocs', 'build'])


@docs.command(name='serve-mkdocs', help="View generated documentation")
def viewmkdocs():
    _verify_mk_docs()
    check_call(['mkdocs', 'serve'])


@cli.command(name='console', help="Run the selected application in an IPython "
             "console. The application is loaded in the variable 'app'.")
@click.argument('application')
@click.option('--user', '-u', required=True, help="User name to run as")
@click.option('--password', '-p', help='Password for user')
def console(application, user, password=None):
    import IPython
    import lime_application
    import lime_acl
    import lime_config
    import lime_session
    import yaml

    if not password:
        password = getpass.getpass()

    session = lime_session.create_session(database=application,
                                          username=user,
                                          password=password,
                                          language='en')

    lime_config.load_config('development console', {})
    app = lime_application.get_application(application,
                                           session=session,
                                           acl=lime_acl.AlwaysAllowAcl())

    banner = """\
**** Welcome to the Lime CRM development console ****

The application object for "{appname}" is stored in the variable 'app'.

Current configuration:
{currconfig}

You might add additional configuration at "{configpath}".
    """.format(
        appname=application,
        currconfig=yaml.safe_dump(
            lime_config.config, default_flow_style=False),
        configpath=lime_config.config_file_path('development console'))

    IPython.embed(argv=[], user_ns={'app': app}, banner1=banner)


def rm(path):
    if os.path.isfile(path):
        os.remove(path)


def rm_rf(path):
    if os.path.isdir(path):
        shutil.rmtree(path)


@contextmanager
def cd(path):
    cwd = os.getcwd()
    try:
        os.chdir(path)
        yield
    finally:
        os.chdir(cwd)


def browse_to(filepath):
    filepath = os.path.abspath(filepath)
    webbrowser.open_new_tab(f'file:///{filepath}')


def _setup_logger(level):
    global_log = logging.getLogger()
    global_log.setLevel(getattr(logging, level))
    global_log.addHandler(logging.StreamHandler(sys.stdout))


def _verify_mk_docs():
    if not os.path.isfile('./mkdocs.yml'):
        print('Mkdocs not yet generated. \
            Run "lime-project generate docs mkdocs" command')
        raise FileNotFoundError

    try:
        import mkdocs # noqa
    except ImportError:
        print('Mkdocs docs is not installed. \
            Run "pip install -r docs/requirements.txt"')
        raise ImportError


def run_cli():
    try:
        sys.exit(cli())
    except CalledProcessError as e:
        logger.error(e)
        sys.exit(e.returncode)
    except Exception as e:
        logger.error(e)
        sys.exit(-1)


if __name__ == '__main__':
    with cd(ROOT):
        run_cli()
