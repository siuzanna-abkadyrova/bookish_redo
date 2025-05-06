import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Member } from '../Member/MemberDetails';

const MemberComponent: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/member');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date_of_birth: parseInt(formData.date_of_birth)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({ name: '', date_of_birth: '', email: '' });
        fetchMembers();
      } else {
        setMessage(data.error || 'Failed to add member.');
      }
    } catch (error) {
      setMessage('Network error. Could not add member.');
    }
  };

  return (
    <div>
      <h2>Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <Link to={`/member/${member.id}`}>
              {member.name} (Born: {member.date_of_birth}) - {member.email}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Add a New Member</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="date_of_birth"
          placeholder="Year of Birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
};

export default MemberComponent;