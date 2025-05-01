from bookish.app import db

class Copy(db.Model):
    __tablename__ = 'Copy'

    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('Book.id'), nullable=False)
    book = db.relationship('Book', backref=db.backref('copies', lazy=True))

    def __init__(self, book_id):
        self.book_id = book_id

    def __repr__(self):
        return f'<Copy id={self.id}, book_id={self.book_id}>'

    def serialize(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'book': self.book.serialize()
        }
