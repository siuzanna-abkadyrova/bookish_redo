from flask import request, jsonify

from bookish.models.book import Book
from bookish.app import db
from flask import Blueprint

bookController = Blueprint('book_controller', __name__)

@bookController.route('/book', methods=['POST', 'GET'])
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

@bookController.route('/book/<int:book_id>', methods=['GET'])
def get_book_by_id(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    return jsonify({
        'id': book.id,
        'title': book.title,
        'publicationyear': book.publicationyear,
        'author': book.author
    })