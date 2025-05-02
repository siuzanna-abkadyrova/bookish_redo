import React, { useEffect, useState } from 'react';

interface IMember {
  id: number;
  date_of_birth: number;
  email: string;
  name: string;
}

function Members() {
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/member")
      .then(res => res.json())
      .then(data => {
        setMembers(data);
      });
  }, []);

  return (
    <div className="members">
      {members.map(member => (
        <ul>
          <li key={`${member.id}-member`}>
            <span>{member.name}</span>
            <span>{member.email}</span>
            <span>{member.date_of_birth}</span>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default Members;
