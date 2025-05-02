from bookish.app import db

class Copy(db.Model):
    __tablename__ = 'Copy'

    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('Book.id'), nullable=False)
    book = db.relationship('Book', backref=db.backref('copies', lazy=True))

    def __init__(self, book_id):
        self.book_id = book_id

    def __repr__(self):
        return f'<Copy id={self.id}, book_id={self.book_id} member_id={self.member_id}>'

    def serialize(self):
        current_borrow = next(
            (b for b in sorted(self.borrows, key=lambda b: b.borrow_date, reverse=True) if b.return_date is None), None)
        return {
            'id': self.id,
            'book_id': self.book_id,
            'book': self.book.serialize(),
            'current_borrower': current_borrow.member.serialize() if current_borrow else None
        }
