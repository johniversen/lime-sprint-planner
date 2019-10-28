import http.client
import json
import lime_test.app
import lime_test.db
import lime_test.web_app
import pytest


def test_return_zero_if_no_companies(webapp):

    res = webapp.get(
        '/myapp/limepkg-uni/count/?limetype=company')

    assert res.status_code == http.client.OK

    json_response = json.loads(res.data.decode('utf-8'))

    assert json_response == {
        'message': 'Hello, Kenny! There are 0 objects '
        'of type company available'
    }


def test_return_one_if_one_company_present(webapp, acme_company):

    res = webapp.get(
        '/myapp/limepkg-uni/count/?limetype=company')

    assert res.status_code == http.client.OK

    json_response = json.loads(res.data.decode('utf-8'))

    assert json_response == {
        'message': 'Hello, Kenny! There are 1 objects '
        'of type company available'
    }


@pytest.fixture
def webapp(limeapp, database, plugins_path, monkeypatch):
    """An in-memory web application where you're authenticated as a user"""
    web_app = lime_test.web_app.create_web_app(database,
                                               plugins_path=plugins_path,
                                               monkeypatch=monkeypatch)

    return lime_test.web_app.create_authenticated_web_client(web_app=web_app,
                                                             app=limeapp,
                                                             username='kenny',
                                                             password='kenny')


@pytest.fixture
def acme_company(limeapp):
    """A company that gets added to `limeapp`"""
    uow = limeapp.unit_of_work()
    acme = limeapp.limetypes.company(name='Acme Inc.')
    acme_idx = uow.add(acme)
    res = uow.commit()
    return res.get(acme_idx)
