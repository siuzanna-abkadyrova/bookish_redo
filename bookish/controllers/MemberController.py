from flask import request, jsonify

from bookish.models.book import Book
from bookish.models.borrow import Borrow
from bookish.models.member import Member
from bookish.models.copy import Copy
from bookish.app import db
from flask import Blueprint

memberController = Blueprint('member_controller', __name__)

@memberController.route('/member', methods=['POST', 'GET'])
def handle_member():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            new_member = Member(name=data['name'], date_of_birth=data['date_of_birth'], email=data['email'])
            db.session.add(new_member)
            db.session.commit()
            return {"message": "New member has been added successfully."}
        else:
            return {"error": "The request payload is not in JSON format"}

    elif request.method == 'GET':
        members = Member.query.all()
        return jsonify([member.serialize() for member in members])

@memberController.route('/member/assign_copy/<int:member_id>/', methods=['POST'])
def assign_copy(member_id):
    data = request.get_json()
    copy_id = data.get('copy_id')

    member = Member.query.get(member_id)
    book_copy = Copy.query.get(copy_id)

    if not member or not book_copy:
        return {"error": "Member or book copy not found"}, 404

    if book_copy.is_checked_out:
        return {"error": "Book copy is already checked out"}, 400

    book_copy.member_id = member.id
    book_copy.is_checked_out = True
    db.session.commit()

    return {"message": f"Book copy {copy_id} has been assigned to member {member_id}"}

@memberController.route('/member/<int:member_id>', methods=['GET'])
def get_member_by_id(member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    return jsonify({
        'id': member.id,
        'name': member.name,
        'date_of_birth': member.date_of_birth,
        'email': member.email
    })

@memberController.route('/member/<int:member_id>/details', methods=['GET'])
def get_member_details(member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    # Fetch borrowed books for the member
    borrows = Borrow.query.filter_by(member_id=member_id).all()
    borrowed_books = []
    for borrow in borrows:
        copy = Copy.query.get(borrow.copy_id)
        if copy:
            book = Book.query.get(copy.book_id)
            borrowed_books.append({
                'title': book.title,
                'author': book.author,
                'publicationyear': book.publicationyear
            })

    return jsonify({
        'member': {
            'id': member.id,
            'name': member.name,
            'date_of_birth': member.date_of_birth,
            'email': member.email
        },
        'borrowed_books': borrowed_books
    })