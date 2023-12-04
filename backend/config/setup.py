from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__, static_folder='../static')
socketio = SocketIO(app, cors_allowed_origins="*")