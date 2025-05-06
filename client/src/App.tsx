import './App.css';
import Books from './pages/Books/Books';
import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import Members from './pages/Members/Members';
import AssignCopy from './pages/AssignCopy/AssignCopy';
import MemberDetails from './pages/Member/MemberDetails';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/books">Books</Link> | <Link to="/members">Members</Link> | <Link to="/assign-copy">Assign a copy of a book</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Welcome to the Book Library</h1>} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path='/assign-copy' element={<AssignCopy />} />
          <Route path="/member/:id" element={<MemberDetails />} />
        </Routes>
      </div>
  </Router>
  );
}

export default App;
