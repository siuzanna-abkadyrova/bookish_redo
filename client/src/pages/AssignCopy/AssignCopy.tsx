import React, { useEffect, useState } from 'react';
import { Member } from '../Member/MemberDetails';

interface Copy {
    id: number;
    book_id: number;
    book: {
      title: string;
      publicationyear: number;
      author: string;
    };
    current_borrower?: {
        id: number;
        name: string;
        date_of_birth: number;
        email: string;
      }
  }

const AssignCopy: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [copies, setCopies] = useState<Copy[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedCopyId, setSelectedCopyId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMembers();
    fetchCopies();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('http://localhost:5000/member');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const fetchCopies = async () => {
    try {
      const res = await fetch('http://localhost:5000/copy');
      const data: Copy[] = await res.json();
      const availableCopies = data.filter((c) => !c.current_borrower);
      setCopies(availableCopies);
    } catch (error) {
      console.error('Failed to fetch copies:', error);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch('http://localhost:5000/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: parseInt(selectedMemberId),
          copy_id: parseInt(selectedCopyId)
        })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        const bookRes = await fetch(`http://localhost:5000/book/${selectedCopyId}`);
        const bookData = await bookRes.json();

        const memberRes = await fetch(`http://localhost:5000/member/${selectedMemberId}`);
        const memberData = await memberRes.json();
  
        setMessage(
          `✅ Success: "${bookData.title}" by ${bookData.author} (Published in ${bookData.publicationyear}) has been assigned to ${memberData.name} (${memberData.email}).`
        );
  
        setSelectedMemberId('');
        setSelectedCopyId('');
        fetchCopies(); 
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to assign copy'}`);
      }
    } catch (error) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div>
      <h2>Assign a Book Copy to a Member</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Member:
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            required
          >
            <option value="">-- Select Member --</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} (ID: {m.id})
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Available Copy:
          <select
            value={selectedCopyId}
            onChange={(e) => setSelectedCopyId(e.target.value)}
            required
          >
            <option value="">-- Select Copy --</option>
            {copies.map((c) => (
            <option key={c.id} value={c.id}>
                "{c.book.title}" by {c.book.author} (Copy ID: {c.id})
            </option>
            ))}
          </select>
        </label>
        <br />

        <button type="submit">Assign</button>
      </form>
    </div>
  );
};

export default AssignCopy;