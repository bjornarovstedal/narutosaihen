import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './Chapter.css';
import InteractiveImage from './InteractiveImage';
import ForestOfDeathPerimeter from './ForestOfDeathPerimeter';
import TeamViewer from './TeamViewer';

const imageComponentMap = {
  ForestOfDeathPerimeter: ForestOfDeathPerimeter,
  TeamViewer: TeamViewer,
};

function parseText(text) {
  const parts = text.split(/(<i>.*?<\/i>|<span class='ellipsis'>.*?<\/span>|<a href='.*?'>.*?<\/a>)/g);
  return parts.map((part, index) => {
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

function Chapter({ englishTitle, romanizedTitle, kanjiTitle, content, images = [], parts = null, allChapters = [], currentChapterIndex = 0, currentPartIndex = 0, onNavigate = () => {}, onPartChange = () => {}, onHome = null, isMobileMenuOpen, setIsMobileMenuOpen, isMenuVisible, setIsMenuVisible, preserveScrollRef }) {
  const currentPart = currentPartIndex;
  const navigate = useNavigate();
  const [isAtTop, setIsAtTop] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  
  const displayContent = parts ? parts[currentPart].content : content;
  const displayImages = parts ? (parts[currentPart].images || []) : (images || []);

  const lines = displayContent.split(/\r?\n/);

  // Scroll to top when chapter or part changes, unless preserveScrollRef is true
  useEffect(() => {
    if (!preserveScrollRef?.current) {
      window.scrollTo(0, 0);
    } else {
      // Reset the flag after reading it
      preserveScrollRef.current = false;
    }
  }, [currentChapterIndex, currentPartIndex]);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Handle touch start
  const onTouchStart = (e) => {
    if (isTransitioning) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setSwipeOffset(0);
    setIsHorizontalSwipe(false);
  };

  // Handle touch move
  const onTouchMove = (e) => {
    if (isTransitioning) return;
    
    if (touchStart !== null && touchStartY !== null) {
      const currentX = e.targetTouches[0].clientX;
      const currentY = e.targetTouches[0].clientY;
      const diffX = Math.abs(currentX - touchStart);
      const diffY = Math.abs(currentY - touchStartY);
      
      // Determine if this is a horizontal swipe (more horizontal than vertical movement)
      if (!isHorizontalSwipe && (diffX > 10 || diffY > 10)) {
        setIsHorizontalSwipe(diffX > diffY);
      }
      
      // Only apply offset if it's a horizontal swipe
      if (isHorizontalSwipe) {
        e.preventDefault(); // Prevent scrolling when doing horizontal swipe
        e.stopPropagation(); // Stop event from bubbling
        const currentOffset = currentX - touchStart;
        
        // Check if there's a next/prev chapter before allowing the swipe
        const nextData = getNextChapterData();
        const prevData = getPrevChapterData();
        
        // Prevent swipe right if no previous chapter, prevent swipe left if no next chapter
        let limitedOffset = currentOffset;
        if (currentOffset > 0 && !prevData) {
          limitedOffset = 0; // No previous chapter, don't allow right swipe
        } else if (currentOffset < 0 && !nextData) {
          limitedOffset = 0; // No next chapter, don't allow left swipe
        } else {
          // Limit the swipe offset to prevent excessive dragging
          limitedOffset = Math.max(-300, Math.min(300, currentOffset));
        }
        
        setSwipeOffset(limitedOffset);
      }
    }
    
    if (isHorizontalSwipe) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  // Handle touch end
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning || !isHorizontalSwipe) {
      setSwipeOffset(0);
      setTouchStart(null);
      setTouchEnd(null);
      setIsHorizontalSwipe(false);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Check if there's a next chapter before attempting navigation
      const nextData = getNextChapterData();
      if (!nextData) {
        // No next chapter available, just reset
        setSwipeOffset(0);
        setTouchStart(null);
        setTouchEnd(null);
        setIsHorizontalSwipe(false);
        return;
      }
      
      setIsTransitioning(true);
      setSwipeOffset(-window.innerWidth);
      
      setTimeout(() => {
        // Swipe left - go to next chapter/part
        const currentChapter = allChapters[currentChapterIndex];
        
        if (currentChapter.parts && currentPartIndex < currentChapter.parts.length - 1) {
          if (currentChapter.parts.slice(currentPartIndex + 1).some(p => p.available !== false)) {
            for (let i = currentPartIndex + 1; i < currentChapter.parts.length; i++) {
              if (currentChapter.parts[i].available !== false) {
                onPartChange(i);
                setSwipeOffset(0);
                setIsTransitioning(false);
                return;
              }
            }
          }
        }
        
        if (currentChapterIndex < allChapters.length - 1) {
          for (let i = currentChapterIndex + 1; i < allChapters.length; i++) {
            if (allChapters[i].available !== false) {
              const nextChapter = allChapters[i];
              if (nextChapter.parts) {
                for (let j = 0; j < nextChapter.parts.length; j++) {
                  if (nextChapter.parts[j].available !== false) {
                    onNavigate(i, j);
                    setSwipeOffset(0);
                    setIsTransitioning(false);
                    return;
                  }
                }
              } else {
                onNavigate(i, 0);
                setSwipeOffset(0);
                setIsTransitioning(false);
                return;
              }
            }
          }
        }
        
        setSwipeOffset(0);
        setIsTransitioning(false);
      }, 300);
    } else if (isRightSwipe) {
      // Check if there's a previous chapter before attempting navigation
      const prevData = getPrevChapterData();
      if (!prevData) {
        // No previous chapter available, just reset
        setSwipeOffset(0);
        setTouchStart(null);
        setTouchEnd(null);
        setIsHorizontalSwipe(false);
        return;
      }
      
      setIsTransitioning(true);
      setSwipeOffset(window.innerWidth);
      
      setTimeout(() => {
        // Swipe right - go to previous chapter/part
        const currentChapter = allChapters[currentChapterIndex];
        
        if (currentChapter.parts && currentPartIndex > 0) {
          if (currentChapter.parts.slice(0, currentPartIndex).some(p => p.available !== false)) {
            for (let i = currentPartIndex - 1; i >= 0; i--) {
              if (currentChapter.parts[i].available !== false) {
                onPartChange(i);
                setSwipeOffset(0);
                setIsTransitioning(false);
                return;
              }
            }
          }
        }
        
        if (currentChapterIndex > 0) {
          for (let i = currentChapterIndex - 1; i >= 0; i--) {
            if (allChapters[i].available !== false) {
              const prevChapter = allChapters[i];
              if (prevChapter.parts) {
                for (let j = prevChapter.parts.length - 1; j >= 0; j--) {
                  if (prevChapter.parts[j].available !== false) {
                    onNavigate(i, j);
                    setSwipeOffset(0);
                    setIsTransitioning(false);
                    return;
                  }
                }
              } else {
                onNavigate(i, 0);
                setSwipeOffset(0);
                setIsTransitioning(false);
                return;
              }
            }
          }
        }
        
        setSwipeOffset(0);
        setIsTransitioning(false);
      }, 300);
    } else {
    setIsHorizontalSwipe(false);
      // Snap back if swipe was too short
      setSwipeOffset(0);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Scroll detection for burger menu styling
  useEffect(() => {
    const handleScroll = () => {
      // Consider "at top" if scrolled less than 200px
      setIsAtTop(window.scrollY < 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentChapter = allChapters[currentChapterIndex];
        
        // Check if we can go previous
        if (currentChapter.parts && currentPartIndex > 0) {
          if (currentChapter.parts.slice(0, currentPartIndex).some(p => p.available !== false)) {
            // Go to previous part in current chapter
            for (let i = currentPartIndex - 1; i >= 0; i--) {
              if (currentChapter.parts[i].available !== false) {
                onPartChange(i);
                return;
              }
            }
          }
        }
        
        // Go to previous chapter
        if (currentChapterIndex > 0) {
          for (let i = currentChapterIndex - 1; i >= 0; i--) {
            if (allChapters[i].available !== false) {
              const prevChapter = allChapters[i];
              if (prevChapter.parts) {
                for (let j = prevChapter.parts.length - 1; j >= 0; j--) {
                  if (prevChapter.parts[j].available !== false) {
                    onNavigate(i, j);
                    return;
                  }
                }
              } else {
                onNavigate(i, 0);
                return;
              }
            }
          }
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const currentChapter = allChapters[currentChapterIndex];
        
        // Check if we can go next
        if (currentChapter.parts && currentPartIndex < currentChapter.parts.length - 1) {
          if (currentChapter.parts.slice(currentPartIndex + 1).some(p => p.available !== false)) {
            // Go to next part in current chapter
            for (let i = currentPartIndex + 1; i < currentChapter.parts.length; i++) {
              if (currentChapter.parts[i].available !== false) {
                onPartChange(i);
                return;
              }
            }
          }
        }
        
        // Go to next chapter
        if (currentChapterIndex < allChapters.length - 1) {
          for (let i = currentChapterIndex + 1; i < allChapters.length; i++) {
            if (allChapters[i].available !== false) {
              const nextChapter = allChapters[i];
              if (nextChapter.parts) {
                for (let j = 0; j < nextChapter.parts.length; j++) {
                  if (nextChapter.parts[j].available !== false) {
                    onNavigate(i, j);
                    return;
                  }
                }
              } else {
                onNavigate(i, 0);
                return;
              }
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIndex, currentPartIndex, allChapters, onNavigate, onPartChange]);

  // Get next chapter/part data for preview
  const getNextChapterData = () => {
    const currentChapter = allChapters[currentChapterIndex];
    
    if (currentChapter.parts && currentPartIndex < currentChapter.parts.length - 1) {
      for (let i = currentPartIndex + 1; i < currentChapter.parts.length; i++) {
        if (currentChapter.parts[i].available !== false) {
          return {
            englishTitle: currentChapter.englishTitle,
            romanizedTitle: currentChapter.romanizedTitle,
            kanjiTitle: currentChapter.kanjiTitle,
            content: currentChapter.parts[i].content,
            partLabel: currentChapter.parts[i].label,
            hasParts: true,
            images: currentChapter.parts[i].images || [],
          };
        }
      }
    }
    
    if (currentChapterIndex < allChapters.length - 1) {
      for (let i = currentChapterIndex + 1; i < allChapters.length; i++) {
        if (allChapters[i].available !== false) {
          const nextChapter = allChapters[i];
          if (nextChapter.parts) {
            for (let j = 0; j < nextChapter.parts.length; j++) {
              if (nextChapter.parts[j].available !== false) {
                return {
                  englishTitle: nextChapter.englishTitle,
                  romanizedTitle: nextChapter.romanizedTitle,
                  kanjiTitle: nextChapter.kanjiTitle,
                  content: nextChapter.parts[j].content,
                  partLabel: nextChapter.parts[j].label,
                  hasParts: true,
                  images: nextChapter.parts[j].images || [],
                };
              }
            }
          } else {
            return {
              englishTitle: nextChapter.englishTitle,
              romanizedTitle: nextChapter.romanizedTitle,
              kanjiTitle: nextChapter.kanjiTitle,
              content: nextChapter.content,
              partLabel: null,
              hasParts: false,
              images: nextChapter.images || [],
            };
          }
        }
      }
    }
    return null;
  };

  // Get previous chapter/part data for preview
  const getPrevChapterData = () => {
    const currentChapter = allChapters[currentChapterIndex];
    
    if (currentChapter.parts && currentPartIndex > 0) {
      for (let i = currentPartIndex - 1; i >= 0; i--) {
        if (currentChapter.parts[i].available !== false) {
          return {
            englishTitle: currentChapter.englishTitle,
            romanizedTitle: currentChapter.romanizedTitle,
            kanjiTitle: currentChapter.kanjiTitle,
            content: currentChapter.parts[i].content,
            partLabel: currentChapter.parts[i].label,
            hasParts: true,
            images: currentChapter.parts[i].images || [],
          };
        }
      }
    }
    
    if (currentChapterIndex > 0) {
      for (let i = currentChapterIndex - 1; i >= 0; i--) {
        if (allChapters[i].available !== false) {
          const prevChapter = allChapters[i];
          if (prevChapter.parts) {
            for (let j = prevChapter.parts.length - 1; j >= 0; j--) {
              if (prevChapter.parts[j].available !== false) {
                return {
                  englishTitle: prevChapter.englishTitle,
                  romanizedTitle: prevChapter.romanizedTitle,
                  kanjiTitle: prevChapter.kanjiTitle,
                  content: prevChapter.parts[j].content,
                  partLabel: prevChapter.parts[j].label,
                  hasParts: true,
                  images: prevChapter.parts[j].images || [],
                };
              }
            }
          } else {
            return {
              englishTitle: prevChapter.englishTitle,
              romanizedTitle: prevChapter.romanizedTitle,
              kanjiTitle: prevChapter.kanjiTitle,
              content: prevChapter.content,
              partLabel: null,
              hasParts: false,
              images: prevChapter.images || [],
            };
          }
        }
      }
    }
    return null;
  };

  const nextChapterData = getNextChapterData();
  const prevChapterData = getPrevChapterData();

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
      {onHome && (
        <button className="side-home-button" onClick={() => setIsMenuVisible(!isMenuVisible)}>
          {isMenuVisible ? '<' : '>'}
        </button>
      )}
      <div 
        className="chapter-swipe-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {prevChapterData && swipeOffset > 0 && (
          <article 
            className="chapter chapter-preview chapter-preview-prev"
            style={{
              transform: `translateX(calc(-100% + ${swipeOffset}px))`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
              top: `${window.scrollY}px`,
            }}
          >
            <h2 className="chapter-title-romanized">"{prevChapterData.romanizedTitle}"</h2>
            <div className="chapter-title-with-nav">
              <span className="nav-text nav-left">←</span>
              <h2 className="chapter-title-english">{prevChapterData.englishTitle}</h2>
              <span className="nav-text nav-right">→</span>
            </div>
            <h3 className="chapter-title-kanji">{prevChapterData.kanjiTitle}</h3>
            {prevChapterData.hasParts && prevChapterData.partLabel && (
              <div className="chapter-navigation">
                <span className="nav-text nav-left">←</span>
                <span className="current-part-label">{prevChapterData.partLabel}</span>
                <span className="nav-text nav-right">→</span>
              </div>
            )}
            {prevChapterData.images.map((img, idx) => {
              const ImgComponent = img.component
                ? imageComponentMap[img.component] || InteractiveImage
                : InteractiveImage;
              return (
                <ImgComponent
                  key={idx}
                  src={img.src}
                  alt={img.alt}
                  info={img.info}
                  teams={img.teams}
                />
              );
            })}
            <div className="chapter-content">
              {prevChapterData.content.split(/\r?\n/).map((line, index) => (
                line === '' ? (
                  <div key={index} className="chapter-blank-line"></div>
                ) : (
                  <p key={index} className="chapter-line">{line}</p>
                )
              ))}
            </div>
            <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #d0d0d0' }} />
            <div className="chapter-navigation-bottom">
              <span className="nav-button nav-button-left">← previous</span>
              <span className="nav-button nav-button-right">next →</span>
            </div>
          </article>
        )}
        <article 
          className="chapter"
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
          }}
        >
      <h2 className="chapter-title-romanized">"{romanizedTitle}"</h2>
      {(() => {
        const hasPrevChapter = currentChapterIndex > 0 && allChapters.slice(0, currentChapterIndex).some(ch => ch.available !== false);
        const hasNextChapter = currentChapterIndex < allChapters.length - 1 && allChapters.slice(currentChapterIndex + 1).some(ch => ch.available !== false);
        
        const goToPrevChapter = () => {
          for (let i = currentChapterIndex - 1; i >= 0; i--) {
            if (allChapters[i].available !== false) {
              onNavigate(i, 0, true); // true = preserve scroll
              break;
            }
          }
        };
        
        const goToNextChapter = () => {
          for (let i = currentChapterIndex + 1; i < allChapters.length; i++) {
            if (allChapters[i].available !== false) {
              onNavigate(i, 0, true); // true = preserve scroll
              break;
            }
          }
        };
        
        return (
          <div className="chapter-title-with-nav">
            <span 
              className={`nav-text nav-left ${!hasPrevChapter ? 'disabled' : ''}`}
              onClick={() => hasPrevChapter && goToPrevChapter()}
            >
              ←
            </span>
            
            <h2 className="chapter-title-english">{englishTitle}</h2>
            
            <span 
              className={`nav-text nav-right ${!hasNextChapter ? 'disabled' : ''}`}
              onClick={() => hasNextChapter && goToNextChapter()}
            >
              →
            </span>
          </div>
        );
      })()}
      <h2 className="chapter-title-kanji">{kanjiTitle}</h2>
      
      {parts && (() => {
        const hasPrevAvailable = currentPart > 0 && parts.slice(0, currentPart).some(p => p.available !== false);
        const hasNextAvailable = currentPart < parts.length - 1 && parts.slice(currentPart + 1).some(p => p.available !== false);
        
        const goToPrevAvailable = () => {
          for (let i = currentPart - 1; i >= 0; i--) {
            if (parts[i].available !== false) {
              onPartChange(i, true); // true = preserve scroll
              break;
            }
          }
        };
        
        const goToNextAvailable = () => {
          for (let i = currentPart + 1; i < parts.length; i++) {
            if (parts[i].available !== false) {
              onPartChange(i, true); // true = preserve scroll
              break;
            }
          }
        };
        
        return (
          <div className="chapter-navigation">
            <span 
              className={`nav-text nav-left ${!hasPrevAvailable ? 'disabled' : ''}`}
              onClick={() => hasPrevAvailable && goToPrevAvailable()}
            >
              ←
            </span>
            
            <span className="current-part-label">{parts[currentPart].englishTitle}</span>
            
            <span 
              className={`nav-text nav-right ${!hasNextAvailable ? 'disabled' : ''}`}
              onClick={() => hasNextAvailable && goToNextAvailable()}
            >
              →
            </span>
          </div>
        );
      })()}

      {/* Render images BEFORE content */}
      {displayImages.map((img, idx) => {
        const ImgComponent = img.component
          ? imageComponentMap[img.component] || InteractiveImage
          : InteractiveImage;
        return (
          <ImgComponent
            key={idx}
            src={img.src}
            alt={img.alt}
            info={img.info}
            teams={img.teams}
          />
        );
      })}

      <div className="chapter-content">
        {lines.map((line, idx) =>
          line.trim() === '' ? (
            <div key={idx} className="chapter-blank-line"></div>
          ) : (
            <p key={idx} className="chapter-line">{parseText(line)}</p>
          )
        )}
      </div>

      {/* Bottom chapter navigation */}
      {(() => {
        const currentChapter = allChapters[currentChapterIndex];
        
        // Check if there's a previous part/chapter
        const hasPrev = () => {
          // If we're not on the first part of the current chapter, check for previous parts
          if (currentChapter.parts && currentPartIndex > 0) {
            if (currentChapter.parts.slice(0, currentPartIndex).some(p => p.available !== false)) {
              return true;
            }
          }
          // Check for previous chapters
          if (currentChapterIndex > 0) {
            for (let i = currentChapterIndex - 1; i >= 0; i--) {
              const ch = allChapters[i];
              if (ch.available !== false) {
                if (ch.parts) {
                  if (ch.parts.some(p => p.available !== false)) return true;
                } else {
                  return true;
                }
              }
            }
          }
          return false;
        };
        
        // Check if there's a next part/chapter
        const hasNext = () => {
          // If there are more parts in the current chapter, check them
          if (currentChapter.parts && currentPartIndex < currentChapter.parts.length - 1) {
            if (currentChapter.parts.slice(currentPartIndex + 1).some(p => p.available !== false)) {
              return true;
            }
          }
          // Check for next chapters
          if (currentChapterIndex < allChapters.length - 1) {
            for (let i = currentChapterIndex + 1; i < allChapters.length; i++) {
              const ch = allChapters[i];
              if (ch.available !== false) {
                if (ch.parts) {
                  if (ch.parts.some(p => p.available !== false)) return true;
                } else {
                  return true;
                }
              }
            }
          }
          return false;
        };
        
        const goToPrev = () => {
          // Try to go to previous part in current chapter
          if (currentChapter.parts && currentPartIndex > 0) {
            for (let i = currentPartIndex - 1; i >= 0; i--) {
              if (currentChapter.parts[i].available !== false) {
                onPartChange(i);
                return;
              }
            }
          }
          // Go to previous chapter's last available part
          for (let i = currentChapterIndex - 1; i >= 0; i--) {
            if (allChapters[i].available !== false) {
              const prevChapter = allChapters[i];
              if (prevChapter.parts) {
                // Find last available part
                for (let j = prevChapter.parts.length - 1; j >= 0; j--) {
                  if (prevChapter.parts[j].available !== false) {
                    onNavigate(i, j);
                    return;
                  }
                }
              } else {
                onNavigate(i, 0);
                return;
              }
            }
          }
        };
        
        const goToNext = () => {
          // Try to go to next part in current chapter
          if (currentChapter.parts && currentPartIndex < currentChapter.parts.length - 1) {
            for (let i = currentPartIndex + 1; i < currentChapter.parts.length; i++) {
              if (currentChapter.parts[i].available !== false) {
                onPartChange(i);
                return;
              }
            }
          }
          // Go to next chapter's first available part
          for (let i = currentChapterIndex + 1; i < allChapters.length; i++) {
            if (allChapters[i].available !== false) {
              const nextChapter = allChapters[i];
              if (nextChapter.parts) {
                // Find first available part
                for (let j = 0; j < nextChapter.parts.length; j++) {
                  if (nextChapter.parts[j].available !== false) {
                    onNavigate(i, j);
                    return;
                  }
                }
              } else {
                onNavigate(i, 0);
                return;
              }
            }
          }
        };
        
        return (
          <div className="chapter-navigation-bottom">
            <span 
              className={`nav-button nav-button-left ${!hasPrev() ? 'disabled' : ''}`}
              onClick={() => hasPrev() && goToPrev()}
            >
              ← previous
            </span>
            
            <span 
              className={`nav-button nav-button-right ${!hasNext() ? 'disabled' : ''}`}
              onClick={() => hasNext() && goToNext()}
            >
              next →
            </span>
          </div>
        );
      })()}
      
      <div style={{ textAlign: 'center', padding: '3rem 0 1rem', color: '#888888', fontSize: '0.85rem' }}>
        narutosaihen@proton.me
      </div>
    </article>
    {nextChapterData && swipeOffset < 0 && (
      <article 
        className="chapter chapter-preview chapter-preview-next"
        style={{
          transform: `translateX(calc(100% + ${swipeOffset}px))`,
          transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
          top: `${window.scrollY}px`,
        }}
      >
        <h2 className="chapter-title-romanized">"{nextChapterData.romanizedTitle}"</h2>
        <div className="chapter-title-with-nav">
          <span className="nav-text nav-left">←</span>
          <h2 className="chapter-title-english">{nextChapterData.englishTitle}</h2>
          <span className="nav-text nav-right">→</span>
        </div>
        <h3 className="chapter-title-kanji">{nextChapterData.kanjiTitle}</h3>
        {nextChapterData.hasParts && nextChapterData.partLabel && (
          <div className="chapter-navigation">
            <span className="nav-text nav-left">←</span>
            <span className="current-part-label">{nextChapterData.partLabel}</span>
            <span className="nav-text nav-right">→</span>
          </div>
        )}
        {nextChapterData.images.map((img, idx) => {
          const ImgComponent = img.component
            ? imageComponentMap[img.component] || InteractiveImage
            : InteractiveImage;
          return (
            <ImgComponent
              key={idx}
              src={img.src}
              alt={img.alt}
              info={img.info}
              teams={img.teams}
            />
          );
        })}
        <div className="chapter-content">
          {nextChapterData.content.split(/\r?\n/).map((line, index) => (
            line === '' ? (
              <div key={index} className="chapter-blank-line"></div>
            ) : (
              <p key={index} className="chapter-line">{line}</p>
            )
          ))}
        </div>
        <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #d0d0d0' }} />
        <div className="chapter-navigation-bottom">
          <span className="nav-button nav-button-left">← previous</span>
          <span className="nav-button nav-button-right">next →</span>
        </div>
      </article>
    )}
    </div>
    </div>
  );
}

export default Chapter;