import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <img 
          src={`${process.env.PUBLIC_URL}/images/404illustration.png`}
          alt="404 - Page Not Found"
          className="not-found-image"
        />
        <div className="not-found-text">
          <h1>404</h1>
          <p>This page seems to have gone missing...</p>
          <Link to="/" className="home-link">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
