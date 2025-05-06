import React, { useEffect, useState } from 'react';

export interface Book {
  id: number;
  title: string;
  publicationyear: number;
  author: string;
}

const BookComponent: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    publicationyear: '',
    author: ''
  });
  const [message, setMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState('');


  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/book');
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          publicationyear: parseInt(formData.publicationyear)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFormData({ title: '', publicationyear: '', author: '' });
        fetchBooks();
      } else {
        setMessage(data.error || 'Failed to add book.');
      }
    } catch (error) {
      setMessage('Network error. Could not add book.');
    }
  };

  const handleAddCopy = async (bookId: number) => {
    try {
      const response = await fetch('http://localhost:5000/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_id: bookId, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCopyMessage(`✅ Success: Added a new copy for "${data.book.title}"`);
        fetchBooks(); 
      } else {
        setCopyMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setCopyMessage('❌ Network error. Could not add copy.');
    }
  };

  return (
    <div>
      <h2>Books</h2>
      <ul>
      {copyMessage && <p>{copyMessage}</p>}
        {books.map(book => (
          <li key={book.id}>
            <div>
              {book.title} ({book.publicationyear}) by {book.author}
            </div>
            <button onClick={() => handleAddCopy(book.id)}>Add Copy</button>
          </li>
        ))}
      </ul>

      <h3>Add a New Book</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="publicationyear"
          placeholder="Publication Year"
          value={formData.publicationyear}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default BookComponent;