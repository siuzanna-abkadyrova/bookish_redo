from flask import Blueprint, request, jsonify

from bookish.app import db
from bookish.models.borrow import Borrow
from bookish.models.copy import Copy
from bookish.models.member import Member

borrowController = Blueprint('borrow_controller', __name__)

@borrowController.route('/borrow', methods=['POST'])
def borrow_copy():
    data = request.get_json()
    member_id = data.get('member_id')
    copy_id = data.get('copy_id')

    if not member_id or not copy_id:
        return {"error": "member_id and copy_id are required"}, 400

    member = Member.query.get(member_id)
    copy = Copy.query.get(copy_id)

    if not member or not copy:
        return {"error": "Invalid member or copy ID"}, 404

    active_borrow = Borrow.query.filter_by(copy_id=copy_id, return_date=None).first()
    if active_borrow:
        return {"error": "Copy is already borrowed"}, 409

    borrow = Borrow(member_id=member_id, copy_id=copy_id)
    db.session.add(borrow)
    db.session.commit()

    return jsonify(borrow.serialize()), 201

@borrowController.route('/borrow', methods=['GET'])
def get_borrows():
    borrows = Borrow.query.all()
    return jsonify([borrow.serialize() for borrow in borrows])