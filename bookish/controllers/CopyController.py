from flask import request, jsonify

from bookish.models.copy import Copy
from bookish.models.book import Book
from bookish.app import db
from flask import Blueprint

copyController = Blueprint('copy_controller', __name__)

@copyController.route('/copy', methods=['POST', 'GET'])
def handle_copy():
    if request.method == 'POST':
        data = request.get_json()

        book_id = data.get('book_id')
        if not book_id:
            return jsonify({'error': 'Missing book_id'}), 400

        book = Book.query.get(book_id)
        if not book:
            return jsonify({'error': 'Book not found'}), 404

        new_copy = Copy(book_id=book_id)
        db.session.add(new_copy)
        db.session.commit()

        return jsonify(new_copy.serialize()), 201

    elif request.method == 'GET':
        copies = Copy.query.all()
        return jsonify([copy.serialize() for copy in copies])