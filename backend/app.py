from config.setup import app, socketio
from flask import send_from_directory
from flask_socketio import SocketIO, emit, join_room, send
import uuid
import requests
import os
from PIL import Image
import base64
from utils.querier import query_for_workout_specifications, ChatMessageHistory, query_workout
from io import BytesIO
from langchain.schema.messages import SystemMessage, HumanMessage, AIMessage

@app.route('/')
def hello():
    return 'Hello, World!'

@socketio.on('join-room')
def handle_join_room():
    #Generate random id for room
    room = str(uuid.uuid4())
    join_room(room)
    emit('joined-room', {'room': room})

@socketio.on('update-duration')
def update_duration(data):
    # Data should be formated: {'room': room, 'duration': duration}
    room = data['room']
    duration = data['duration']
    
@socketio.on('user-request')
def handle_user_request(data):
    # Data should be formated:
    # {
    #   'room': string,
    #   'query': string,
    #   'terra-user-id': string
    #   'history': dict
    #   'context-props': dict
    #   'requery': boolean
    # }
    print("---------- USER REQUEST ----------")
    room = data['room']
    query = data['query']
    requery = data['requery']
    prevHistory = ChatMessageHistory()
    if requery:
        messages= data['history']
        prevHistory = ChatMessageHistory.parse_obj(messages)
        for i in range(len(prevHistory.messages)):
            if prevHistory.messages[i].type == "system": 
                prevHistory.messages[i] = SystemMessage(content = prevHistory.messages[i].content)
            elif prevHistory.messages[i].type == "ai":
                prevHistory.messages[i] = AIMessage(content = prevHistory.messages[i].content)
            elif prevHistory.messages[i].type == "human":
                prevHistory.messages[i] = HumanMessage(content = prevHistory.messages[i].content)
        # print(prevHistory['messages'])
        # prevHistory = ChatMessageHistory(messages=messages['messages'])
        # print(prevHistory)
    success, response, history = query_for_workout_specifications("api-key.txt", prevHistory, enable_sleep_hours=False, query=query)
    if not success:
        hist_json = history.json()
        emit('re-query', {'response': response, 'history': query}, room=room)
        return

    # Get the workout
    workout, history = query_workout("api-key.txt", response, None,True)

    workout_json = workout.json()
    emit('workout-response', {'response': workout_json, 'history': history.json()}, room=room)
    '''
    
    #response can either be text or list
    if res_type == 'text':
        # Emit response to room
        emit('text-response', {'response': res}, room=room)
    elif res_type == 'list':
        # Emit response to room
        emit('list-response', {'response': res}, room=room)'''

@socketio.on('terra-auth')
def handle_terra_auth(data):
    #Data should be formated: {'room': room}
    room = data['room']
    url = "https://api.tryterra.co/v2/auth/generateWidgetSession"

    payload = {
        "reference_id": "your_users_id",
        "providers": "GARMIN,WITHINGS,FITBIT,GOOGLE,OURA,WAHOO,PELOTON,ZWIFT,TRAININGPEAKS,FREESTYLELIBRE,DEXCOM,COROS,HUAWEI,OMRON,RENPHO,POLAR,SUUNTO,EIGHT,APPLE,CONCEPT2,WHOOP,IFIT,TEMPO,CRONOMETER,FATSECRET,NUTRACHECK,UNDERARMOUR",
        "language": "en",
        "auth_success_redirect_url":"https://gymbroai.netlify.app/auth/terra"
    }
    headers = {
        "accept": "application/json",
        "dev-id": "harvard-testing-cm5nhKi7If",
        "content-type": "application/json",
        "x-api-key": "JWlqJTpxMiIreDGyP5W5KE25rR-SGULH"
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()

    url = response.json()["url"]
    print(url)
    socketio.emit('terra-auth-url', {'url': url}, room=room)

@app.route('/get-routine-image/<path:filename>')
def get_routine_image(filename):
    filename += ".png"
    return send_from_directory('../workout_images/', filename)

# @socketio.on('get-routine-image')
# def handle_image_request(data):
#     print("---------- GET ROUTINE IMAGE ----------")
#     # Data is formatted: {'room': room, 'image-name': image-name}
#     image_name = data['image-name']
#     # Search for image in workout_images folder going folder by folder
#     image_path = find_image('./workout_images', image_name + '.png')
#     # Open image using PIL
#     with Image.open(image_path) as image:
#         buffered = BytesIO()
#         image.save(buffered, format="JPEG")  # You can change format to PNG or other format if needed
        
#         # Encode image as base64
#         img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
#     send({'image': img_str})

# def find_image(base_folder, image_name):
#     # Iterate over each directory in the base folder
#     for root, dirs, files in os.walk(base_folder):
#         # Check if the image_name is in the list of files in the current directory
#         if image_name in files:
#             # Return the full path of the found image
#             return os.path.join(root, image_name)
#     return None

# def find_png_file(base_directory, target_filename):
#     for root, dirs, files in os.walk(base_directory):
#         for directory in dirs:
#             for file in directory:
#                 if file.lower() == target_filename.lower():
#                     return os.path.join(root, file)

#     return None


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', allow_unsafe_werkzeug=True, port=os.getenv("PORT", default=5500))
