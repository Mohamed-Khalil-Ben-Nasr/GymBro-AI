from terra.base_client import Terra
import datetime
import requests

user_id = ""
user = None
start_date = ""
end_date = ""

terra = Terra(
    api_key='JWlqJTpxMiIreDGyP5W5KE25rR-SGULH',
    dev_id='harvard-testing-cm5nhKi7If',
    secret="YOUR TERRA SECRET"
)

def updateUser(id):
    global user_id, user, start_date, end_date
    user_id = id
    user = terra.from_user_id(user_id)
    start_date="2023-10-07"
    end_date="2023-10-08"


# def connectUserWidget():
#     url = "https://api.tryterra.co/v2/auth/generateWidgetSession"

#     payload = {
#         "reference_id": "your_users_id",
#         "providers": "GARMIN,WITHINGS,FITBIT,GOOGLE,OURA,WAHOO,PELOTON,ZWIFT,TRAININGPEAKS,FREESTYLELIBRE,DEXCOM,COROS,HUAWEI,OMRON,RENPHO,POLAR,SUUNTO,EIGHT,APPLE,CONCEPT2,WHOOP,IFIT,TEMPO,CRONOMETER,FATSECRET,NUTRACHECK,UNDERARMOUR",
#         "language": "en"
#     }
#     headers = {
#         "accept": "application/json",
#         "dev-id": "testingTerra",
#         "content-type": "application/json",
#         "x-api-key": "ussv5SAQ53a1nNTxsMr9G41zj2KUhYMk5eDU1hjG"
#     }

#     response = requests.post(url, json=payload, headers=headers)
#     response.raise_for_status()

#     url = response.json()["url"]


def getUserInfo():
    res = terra.get_user_info(user)
    print(res.json)


#to extract user workout type, calories burnt, and time spent during a single workout session
def getUserActivity():
    url = f'https://api.tryterra.co/v2/activity?user_id={user_id}&start_date={start_date}&end_date={end_date}&to_webhook=false&with_samples=false'

    headers = {
        "accept": "application/json",
        "dev-id": "harvard-testing-cm5nhKi7If",
        "x-api-key": "JWlqJTpxMiIreDGyP5W5KE25rR-SGULH"
    }
    response = requests.get(url, headers=headers)
    workout_type =  response.json()["data"][0]["metadata"]["name"]
    calories_burnt = response.json()["data"][0]["calories_data"]["net_activity_calories"]
    time_spent = response.json()["data"][0]["activity_seconds"]["active_durations_data"]

#to extract user sleep time. maybe should wind the date back by one day?
def getUserSleep():
    url = f'https://api.tryterra.co/v2/sleep?user_id={user_id}&start_date={start_date}&end_date={end_date}&to_webhook=false&with_samples=false'

    headers = {
        "accept": "application/json",
        "dev-id": "harvard-testing-cm5nhKi7If",
        "x-api-key": "JWlqJTpxMiIreDGyP5W5KE25rR-SGULH"
    }

    response = requests.get(url, headers=headers)
    # print(response.json())
    sleep_in_seconds = response.json()["data"][0]["sleep_durations_data"]["asleep"]["duration_asleep_state_seconds"]
    return sleep_in_seconds//3600;

def getUserBody():
    url = f'https://api.tryterra.co/v2/body?user_id={user_id}&start_date={start_date}&end_date={end_date}&to_webhook=false&with_samples=false'

    headers = {
        "accept": "application/json",
        "dev-id": "harvard-testing-cm5nhKi7If",
        "x-api-key": "JWlqJTpxMiIreDGyP5W5KE25rR-SGULH"
    }

    response = requests.get(url, headers=headers)

    print(response.text)

#to extract calory information throughout the entire day
def getUserDaily():
    url = f'https://api.tryterra.co/v2/daily?user_id={user_id}&start_date={start_date}&end_date={end_date}&to_webhook=false&with_samples=false'

    headers = {
        "accept": "application/json",
        "dev-id": "harvard-testing-cm5nhKi7If",
        "x-api-key": "JWlqJTpxMiIreDGyP5W5KE25rR-SGULH"
    }

    response = requests.get(url, headers=headers)

    total_burnt_calories = response.json()["data"][0]["calories_data"]["total_burned_calories"]
    net_activity_calories = response.json()["data"][0]["calories_data"]["net_activity_calories"]
    BMR_calories = response.json()["data"][0]["calories_data"]["BMR_calories"]

updateUser()
print(getUserSleep())
# print(Terra.list_users())