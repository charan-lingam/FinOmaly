import requests
import random

email = 'test' + str(random.randint(1000, 9999)) + '@finomaly.com'
print('Signing up with', email)

res = requests.post('https://finomaly-ejgp.onrender.com/api/v1/signup', json={'email': email, 'password': 'testpassword123'})
print('Signup:', res.status_code, res.text)

res = requests.post('https://finomaly-ejgp.onrender.com/api/v1/login/access-token', data={'username': email, 'password': 'testpassword123'})
print('Login:', res.status_code)
token = res.json().get('access_token')

res = requests.post(
    'https://finomaly-ejgp.onrender.com/api/v1/companies/', 
    headers={'Authorization': f'Bearer {token}'},
    json={'name': 'test', 'ticker': 'test', 'industry': 'test'}
)
print('Create company:', res.status_code, res.text)
