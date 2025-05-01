from bookish.app import db


class Book(db.Model):
    # This sets the name of the table in the database
    __tablename__ = 'Book'

    # Here we outline what columns we want in our database
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String())
    publicationyear = db.Column(db.Integer())
    author = db.Column(db.String())

    def __init__(self, title, publicationyear, author):
        self.title = title
        self.publicationyear = publicationyear
        self.author = author

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'publicationyear': self.publicationyear,
            'author': self.author,
        }
