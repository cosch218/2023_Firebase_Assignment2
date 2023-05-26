import './App.css';

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BookReview from "./pages/BookReview";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/bookreview" element={<BookReview/>}/>
    </Routes>
  );
}

export default App;
