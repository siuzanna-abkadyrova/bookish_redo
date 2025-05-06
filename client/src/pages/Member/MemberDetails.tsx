import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from '../Books/Books';

export {};  // This makes the file a module

export interface Member {
  id: number;
  name: string;
  date_of_birth: number;
  email: string;
}

const MemberDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get memberId from URL
  const [member, setMember] = useState<Member | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/member/${id}/details`);
        const data = await res.json();

        if (res.ok) {
          setMember(data.member);
          setBorrowedBooks(data.borrowed_books);
        } else {
          setError(data.error || 'Failed to fetch member details');
        }
      } catch (error) {
        setError('Failed to fetch data from server');
      }
    };

    if (id) {
      fetchMemberDetails();
    }
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {member ? (
        <div>
          <h2>{member.name}'s Details</h2>
          <p><strong>Email:</strong> {member.email}</p>
          <p><strong>Date of Birth:</strong> {new Date(member.date_of_birth).toLocaleDateString()}</p>

          <h3>Borrowed Books</h3>
          {borrowedBooks.length > 0 ? (
            <ul>
              {borrowedBooks.map((book, index) => (
                <li key={index}>
                  <strong>{book.title}</strong> by {book.author} (Published in {book.publicationyear})
                </li>
              ))}
            </ul>
          ) : (
            <p>No borrowed books</p>
          )}
        </div>
      ) : (
        <p>Loading member details...</p>
      )}
    </div>
  );
};

export default MemberDetails;