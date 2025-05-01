from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from bookish.controllers import register_controllers


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config.from_object(os.environ['APP_SETTINGS'])

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    Migrate(app, db)

    register_controllers(app)

    return app

