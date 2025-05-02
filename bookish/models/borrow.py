from bookish.app import db
from datetime import datetime, timezone


class Borrow(db.Model):
    __tablename__ = 'Borrow'

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('Member.id'), nullable=False)
    copy_id = db.Column(db.Integer, db.ForeignKey('Copy.id'), nullable=False)
    borrow_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    return_date = db.Column(db.DateTime, nullable=True)

    member = db.relationship('Member', backref=db.backref('borrows', lazy=True))
    copy = db.relationship('Copy', backref=db.backref('borrows', lazy=True))

    def serialize(self):
        return {
            'id': self.id,
            'member_id': self.member_id,
            'copy_id': self.copy_id,
            'borrow_date': self.borrow_date.isoformat(),
            'return_date': self.return_date.isoformat() if self.return_date else None
        }