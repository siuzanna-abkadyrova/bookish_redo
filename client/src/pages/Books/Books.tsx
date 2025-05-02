import React, { useEffect, useState } from 'react';

interface IBook {
  id: number;
  author: string;
  publicationyear: number;
  title: string;
}

function Books() {
  const [books, setBooks] = useState<IBook[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/book")
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
      });
  }, []);



  return (
    <div className="books">
      {books.map(book => (
        <ul>
          <li key={`${book.id}-book`}>
            <span>{book.title}</span>
            <span>{book.author}</span>
            <span>{book.publicationyear}</span>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default Books;
