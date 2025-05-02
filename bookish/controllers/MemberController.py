from flask import request, jsonify

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