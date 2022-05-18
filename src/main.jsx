import React from 'react';
import ReactDOM from 'react-dom/client';
import { render } from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './components/LoginPage';
import Submit from './components/Submit';
import './index.css';

const rootElement = document.getElementById('root');
render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/submit" element={<Submit />} />
    </Routes>
  </Router>,
  rootElement
);
