import Navbar from './components/Navbar';
import Content from './components/Content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Thread from './components/Thread';
import Submit from './components/Submit';
import Settings from './components/Settings';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Content posts={posts} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/posts/:id" element={<Thread />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
