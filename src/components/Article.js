import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articles } from '../data/articles/WhyNarutoSaihen';
import { chapters as theHiddenLeaf } from '../data/chapters/TheHiddenLeaf';
import { chapters as leaf16 } from '../data/chapters/Leaf16';
import { chapters as theLandOfWaves } from '../data/chapters/TheLandOfWaves';
import { chapters as forestOfDeathChapters } from '../data/chapters/ForestOfDeath';
import { chapters as whatWontDieChapters } from '../data/chapters/WhatWontDie';
import { chapters as deadlyIsTheViperChapters } from '../data/chapters/DeadlyIsTheViper';
import { chapters as oneMonthChapters } from '../data/chapters/OneMonth';
import { chapters as theFinalsChapters } from '../data/chapters/TheFinals';
import { chapters as thePreliminariesChapters } from '../data/chapters/ThePreliminaries';
import { chapters as theWrittenTestChapters } from '../data/chapters/TheWrittenTest';
import { chapters as sasukeRescueMission } from '../data/chapters/SasukeRescueMission';
import { chapters as aftermath } from '../data/chapters/Aftermath';
import './Article.css';

const createSlug = (text) => {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-');
};

function parseText(text) {
  const parts = text.split(/(<b>.*?<\/b>|<i>.*?<\/i>|<span class='ellipsis'>.*?<\/span>|<a href='.*?'>.*?<\/a>)/g);
  return parts.map((part, index) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <b key={index}>{part.slice(3, -4)}</b>;
    }
    if (part.startsWith('<i>') && part.endsWith('</i>')) {
      return <i key={index}>{part.slice(3, -4)}</i>;
    }
    if (part.startsWith("<span class='ellipsis'>") && part.endsWith('</span>')) {
      return <span key={index} className="ellipsis">{part.slice(23, -7)}</span>;
    }
    if (part.startsWith("<a href='") && part.endsWith('</a>')) {
      const hrefMatch = part.match(/<a href='(.*?)'>(.*?)<\/a>/);
      if (hrefMatch) {
        return <a key={index} href={hrefMatch[1]}>{hrefMatch[2]}</a>;
      }
    }
    return part;
  });
}

function Article() {
  const navigate = useNavigate();
  const { articleSlug } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMenuVisible, setIsMenuVisible] = React.useState(true);
  const [isAtTop, setIsAtTop] = React.useState(true);

  React.useEffect(() => {
    // Set body background to black for About page
    document.body.style.background = '#000000';
    
    // Restore original background on unmount
    return () => {
      document.body.style.background = 'linear-gradient(to bottom, #ffffff 0%, #d1d1d1 100%)';
      document.body.style.backgroundAttachment = 'fixed';
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find the current article, default to first if no slug
  const currentSlug = articleSlug || 'whynarutosaihen';
  const currentArticle = articles.find(a => a.slug === currentSlug) || articles[0];
  
  // Save last viewed article to localStorage
  React.useEffect(() => {
    if (currentArticle) {
      const lastReadArticle = {
        articleSlug: currentArticle.slug,
        articleId: currentArticle.id
      };
      localStorage.setItem('lastReadArticle', JSON.stringify(lastReadArticle));
    }
  }, [currentArticle]);

  if (!currentArticle) {
    return <div>Article not found</div>;
  }

  return (
    <div className="about-page">
      <button 
        className={`mobile-menu-button ${isAtTop ? 'at-top' : 'over-text'}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <button className="side-home-button" onClick={() => setIsMenuVisible(!isMenuVisible)}>
        {isMenuVisible ? '<' : '>'}
      </button>
      <nav className={`chapter-menu ${isMobileMenuOpen ? 'mobile-open' : ''} ${!isMenuVisible ? 'menu-hidden' : ''}`}>
        <div className="menu-sticky-header">
          <div className="home-button-container">
            <button className="home-button" onClick={() => navigate('/')}>
              ← Home
            </button>
          </div>
          <div className="home-button-container">
            <button className="home-button" onClick={() => {
              // Combine all chapters
              const allChapters = [
                ...theHiddenLeaf,
                ...leaf16,
                ...theLandOfWaves,
                ...forestOfDeathChapters,
                ...whatWontDieChapters,
                ...deadlyIsTheViperChapters,
                ...oneMonthChapters,
                ...theFinalsChapters,
                ...thePreliminariesChapters,
                ...theWrittenTestChapters,
                ...sasukeRescueMission,
                ...aftermath
              ].sort((a, b) => a.id - b.id);
              
              // Try to get last read chapter from localStorage
              const lastReadStr = localStorage.getItem('lastReadChapter');
              console.log('lastReadChapter from localStorage:', lastReadStr);
              
              if (lastReadStr) {
                try {
                  const lastRead = JSON.parse(lastReadStr);
                  console.log('Parsed lastRead:', lastRead);
                  const chapter = allChapters.find(ch => ch.id === lastRead.chapterId);
                  console.log('Found chapter:', chapter);
                  
                  // Verify the chapter still exists and is available
                  if (chapter && chapter.available !== false) {
                    if (lastRead.partSlug) {
                      navigate(`/${lastRead.chapterSlug}/${lastRead.partSlug}`);
                    } else {
                      navigate(`/${lastRead.chapterSlug}`);
                    }
                    return;
                  }
                } catch (e) {
                  console.log('Error parsing lastRead:', e);
                  // If parsing fails, continue to default behavior
                }
              }
              
              // Fallback to first available chapter
              console.log('Falling back to first available chapter');
              const firstAvailableChapter = allChapters.find(ch => ch.available !== false);
              console.log('First available chapter:', firstAvailableChapter);
              if (firstAvailableChapter) {
                const slug = createSlug(firstAvailableChapter.englishTitle);
                console.log('English title:', firstAvailableChapter.englishTitle);
                console.log('Generated slug:', slug);
                
                // If the chapter has parts, navigate to the first part
                if (firstAvailableChapter.parts && firstAvailableChapter.parts.length > 0) {
                  const firstPart = firstAvailableChapter.parts[0];
                  const partSlug = createSlug(firstPart.englishTitle);
                  console.log('Chapter has parts, navigating to first part:', partSlug);
                  navigate(`/${slug}/${partSlug}`);
                } else {
                  navigate(`/${slug}`);
                }
              }
            }}>
              Chapters
            </button>
          </div>
          <div className="menu-header">
            <h3>Articles</h3>
          </div>
        </div>
        <div className="menu-scrollable">
          <ul>
          {articles.map((article) => {
            const isActive = currentArticle.id === article.id;
            const activeStyle = isActive ? {
              background: '#000000',
              color: '#ffffff'
            } : {};
            
            return (
              <li key={article.id}>
                <div 
                  className={`chapter-title ${isActive ? 'active' : ''}`}
                  style={activeStyle}
                  onClick={() => navigate(`/${article.slug}`)}
                >
                  {article.title}
                </div>
              </li>
            );
          })}
        </ul>
        </div>
      </nav>
      <div className="about-container">
        <h1 className="about-title">{currentArticle.title}</h1>
        {currentArticle.subtitle && (
          <p className="about-subtitle">{currentArticle.subtitle}</p>
        )}

        <div className="about-content">
          {currentArticle.sections.map((section, index) => (
            <section key={index} className="about-section">
              {section.heading && <h2>{section.heading}</h2>}
              {section.content && section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>{parseText(paragraph)}</p>
              ))}
              {section.list && (
                section.listType === 'ol' ? (
                  <ol className="about-list">
                    {section.list.map((item, lIndex) => (
                      <li key={lIndex}>
                        {typeof item === 'string' ? (
                          item
                        ) : (
                          <>
                            <strong>{item.title}</strong>
                            <br />
                            {Array.isArray(item.description) ? (
                              item.description.map((para, pIdx) => (
                                <span key={pIdx}>
                                  {parseText(para)}
                                  {pIdx < item.description.length - 1 && <><br /></>}
                                </span>
                              ))
                            ) : (
                              parseText(item.description)
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="about-list">
                    {section.list.map((item, lIndex) => (
                      <li key={lIndex}>
                        {typeof item === 'string' ? (
                          item
                        ) : (
                          <>
                            <strong>{item.title}</strong>
                            <br />
                            {Array.isArray(item.description) ? (
                              item.description.map((para, pIdx) => (
                                <span key={pIdx}>
                                  {parseText(para)}
                                  {pIdx < item.description.length - 1 && <><br /></>}
                                </span>
                              ))
                            ) : (
                              parseText(item.description)
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </section>
          ))}
        </div>

        <div className="about-actions">
          <button className="start-reading-button" onClick={() => {
            // Try to get last read chapter from localStorage
            const lastReadStr = localStorage.getItem('lastReadChapter');
            
            if (lastReadStr) {
              try {
                const lastRead = JSON.parse(lastReadStr);
                if (lastRead.partSlug) {
                  navigate(`/${lastRead.chapterSlug}/${lastRead.partSlug}`);
                } else {
                  navigate(`/${lastRead.chapterSlug}`);
                }
                return;
              } catch (e) {
                // If parsing fails, navigate to home
              }
            }
            
            // Fallback to home if no cached chapter
            navigate('/');
          }}>
            Read
          </button>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: '4rem 0 2rem', color: '#888888', fontSize: '0.85rem' }}>
        narutosaihen@proton.me
      </div>
    </div>
  );
}

export default Article;
