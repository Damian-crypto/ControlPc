import requests
import re

BASE_URL = 'http://localhost:5000'
UUID = 'kw1j6z5z59'


def test_server_is_up():
    response = requests.get(BASE_URL + '/')
    pattern = r'^Welcome to the ControlPc \(Server is up at (.+):(\d+)\)$'
    assert response.status_code == 200
    assert re.match(pattern, response.text) is not None


def test_invalid_format():
    response = requests.post(BASE_URL + '/connect')
    assert response.status_code == 400
    assert response.text == 'Invalid request format'


def test_valid_uuid_conection():
    response = requests.post(BASE_URL + '/connect', json={'uuid': UUID})
    assert response.status_code == 200
    assert response.text == 'Authenticated'


def test_invalid_uuid_connection():
    response = requests.post(BASE_URL + '/connect', json={'uuid': "have a nice day"})
    assert response.status_code == 403
    assert response.text == 'Invalid identity'


def test_empty_uuid_connection():
    response = requests.post(BASE_URL + '/connect', json={'uuid': ""})
    assert response.status_code == 403
    assert response.text != 'Authenticated'


def test_screensize():
    response = requests.get(BASE_URL + '/screensize')
    assert response.status_code == 200
    assert str(response.json()) != ''


def test_remote_view():
    response = requests.get(BASE_URL + '/remote')
    assert response.status_code == 200


def test_geo_location():
    response = requests.post(BASE_URL + '/geo_location', json={'uuid': UUID})
    '''
    ^ and $ assert the start and end of the string.
    [+-]? matches an optional + or - sign.
    \d+(\.\d*)? matches an integer part followed by an optional fractional part.
    |\.\d+ matches numbers that start with a decimal point and have digits following it.
    '''
    pattern = r'[[+-]?(\d+(\.\d*)?|\.\d+), [+-]?(\d+(\.\d*)?|\.\d+)]'
    assert response.status_code == 200
    assert re.match(pattern, response.text) is not None
