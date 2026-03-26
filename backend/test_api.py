import requests

url = "http://127.0.0.1:5000/predict"

data = {
    "temperature": 80,
    "vibration": 7,
    "rpm": 3000
}

response = requests.post(url, json=data)

print(response.json())