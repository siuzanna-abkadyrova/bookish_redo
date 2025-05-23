from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(os.environ['APP_SETTINGS'])

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    Migrate(app, db)

    from bookish.controllers.bookish import bookish
    app.register_blueprint(bookish)

    from bookish.controllers.BookController import bookController
    app.register_blueprint(bookController)

    from bookish.controllers.CopyController import copyController
    app.register_blueprint(copyController)#

    from bookish.controllers.MemberController import memberController
    app.register_blueprint(memberController)

    from bookish.controllers.BorrowController import borrowController
    app.register_blueprint(borrowController)

    return app

