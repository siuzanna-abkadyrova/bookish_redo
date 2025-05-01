from flask import request

from bookish.models import example
from bookish.models.example import Example
from bookish.models.book import Book
from bookish.app import db
from flask import render_template, session, Blueprint


bookish = Blueprint('bookish', __name__)


@bookish.route('/healthcheck')
def health_check():
    return {"status": "OK"}


@bookish.route('/example', methods=['POST', 'GET'])
def handle_example():
        if request.method == 'POST':
            if request.is_json:
                data = request.get_json()
                new_example = Example(data1=data['data1'], data2=data['data2'])
                db.session.add(new_example)
                db.session.commit()
                return {"message": "New example has been created successfully."}
            else:
                return {"error": "The request payload is not in JSON format"}

        elif request.method == 'GET':
            examples = Example.query.all()
            results = [
                {
                    'id': example.id,
                    'data1': example.data1,
                    'data2': example.data2
                } for example in examples]
            return {"examples": results}

@bookish.route('/book', methods=['POST', 'GET'])
def handle_book():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_book = Book(title=data['title'], publicationyear=data['publicationyear'], author=data['author'])
            db.session.add(new_book)
            db.session.commit()
            return {"message": "New book has been added successfully."}
        else:
            return {"error": "The request payload is not in JSON format"}

    elif request.method == 'GET':
        books = Book.query.all()
        results = [
            {
                'id': book.id,
                'title': book.title,
                'publicationyear': book.publicationyear,
                'author': book.author
            } for book in books]
        return {"books": results}