import lime_test
import lime_test.core_db.dsl as dsl
import lime_type
import lime_config
import pytest


@pytest.fixture
def limetypes():
    """The limetypes of the core database
    You can change these, or create your own by twiddling with the YAML based
    DSL format for limetypes.
    """
    return lime_type.create_limetypes_from_dsl(dsl.dsl)


@pytest.fixture
def database(limetypes, monkeypatch):
    """An in-memory empty Lime database with the core database limetypes"""
    database = lime_test.db.create_database_with_limetypes(monkeypatch,
                                                           limetypes=limetypes,
                                                           limename='myapp',
                                                           sqlname='myapp')
    return database


@pytest.fixture
def no_registered_limeobjects(monkeypatch):
    """Ensure that we have no registered custom limeobjects for a test"""
    monkeypatch.setattr('lime_type.limetypes.limeobject_classes', {})


@pytest.fixture
def limeapp(database, limetypes, no_registered_limeobjects, monkeypatch):
    """A Lime application with a user/coworker defined"""
    lime_config.load_config('test')
    app = lime_test.app.create_app(monkeypatch, database, limetypes)
    user = lime_test.db.create_and_add_user(database=database,
                                            fullname='Kenny Starfighter',
                                            username='kenny',
                                            password='kenny')
    app.unit_of_work()

    # TODO: Make it possible to create a coworker with this hack
    coworker = app.limetypes.coworker(
        firstname='Kenny',
        lastname='Starfighter',
        name='Kenny Starfighter',
        username=user.id,
        _from_row=True
    )

    uow = app.unit_of_work()
    idx = uow.add(coworker)
    res = uow.commit()

    app._coworker = res.get(idx)

    return app
