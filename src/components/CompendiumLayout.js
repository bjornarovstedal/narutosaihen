import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Compendium.css';
import SidebarNav from './SidebarNav';

export const compendiumEntries = [
  { slug: 'handseals', title: 'Hand Seals' },
];

function CompendiumLayout({ activeSlug = null, children }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="reader-container">
      <button
        className={`mobile-menu-button ${isAtTop ? 'at-top' : 'over-text'}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button
        className="side-home-button"
        onClick={() => setIsMenuVisible(!isMenuVisible)}
      >
        {isMenuVisible ? '<' : '>'}
      </button>

      <nav
        className={`chapter-menu ${isMobileMenuOpen ? 'mobile-open' : ''} ${!isMenuVisible ? 'menu-hidden' : ''}`}
      >
        <div className="menu-sticky-header">
          <SidebarNav active="compendium" />
          <div className="menu-header">
            <h3>Compendium</h3>
          </div>
        </div>
        <div className="menu-scrollable">
          <ul>
            {compendiumEntries.map((entry) => {
              const isActive = entry.slug === activeSlug;
              return (
                <li key={entry.slug}>
                  <div
                    className={`chapter-wrapper ${isActive ? 'active-chapter' : ''}`}
                  >
                    <div
                      className={`chapter-title ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        navigate(`/compendium/${entry.slug}`);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {entry.title}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="compendium-page">{children}</div>
    </div>
  );
}

export default CompendiumLayout;
