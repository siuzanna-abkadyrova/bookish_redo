from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

from bookish.app import create_app
import os

app = create_app()


if __name__ == "__main__":
     # app.run(debug=True, host='0.0.0.0', port=443)
     app.run(debug=True)