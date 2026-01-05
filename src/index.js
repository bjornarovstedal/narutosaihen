import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import LandingPage from './components/LandingPage';
import Reader from './components/Reader';
import Article from './components/Article';
import reportWebVitals from './reportWebVitals';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<Article />} />
        <Route path="/:chapterSlug/:partSlug" element={<Reader />} />
        <Route path="/:chapterSlug" element={<Reader />} />
        <Route path="/articles/:articleSlug" element={<Article />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
