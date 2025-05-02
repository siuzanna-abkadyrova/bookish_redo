from bookish.app import db


class Member(db.Model):
    # This sets the name of the table in the database
    __tablename__ = 'Member'

    # Here we outline what columns we want in our database
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    date_of_birth = db.Column(db.Integer())
    email = db.Column(db.String())

    def __init__(self, name, date_of_birth, email):
        self.name = name
        self.date_of_birth = date_of_birth
        self.email = email

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'date_of_birth': self.date_of_birth,
            'email': self.email,
            'borrows': [borrow.serialize() for borrow in self.borrows]
        }
