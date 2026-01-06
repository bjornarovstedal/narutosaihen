import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { articles } from '../data/articles/WhyNarutoSaihen';
import '../App.css';

function ChapterMenu({ 
  allChapters, 
  currentChapterIndex, 
  currentPartIndex, 
  onNavigate, 
  onHome, 
  isExpanded, 
  setIsExpanded, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  isMenuVisible 
}) {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const isSwiping = useRef(false);
  const swipeDirection = useRef(null); // 'horizontal' or 'vertical'
  const [isAnimatingClose, setIsAnimatingClose] = useState(false);

  // Handle swipe gesture to close menu with visual feedback
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchCurrentX.current = e.touches[0].clientX;
      isSwiping.current = false;
      swipeDirection.current = null;
    };

    const handleTouchMove = (e) => {
      if (!menuRef.current) return;
      
      touchCurrentX.current = e.touches[0].clientX;
      const diffX = touchCurrentX.current - touchStartX.current;
      const diffY = e.touches[0].clientY - touchStartY.current;
      
      // Determine swipe direction if not yet determined
      if (!swipeDirection.current && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          swipeDirection.current = 'horizontal';
        } else {
          swipeDirection.current = 'vertical';
        }
      }
      
      // If horizontal swiping detected, prevent vertical scrolling and handle horizontal movement
      if (swipeDirection.current === 'horizontal') {
        e.preventDefault();
        isSwiping.current = true;
        
        // Only allow moving left (negative diffX), don't allow moving right past initial position
        let translateX = 0;
        if (diffX < 0) {
          // Moving left - allow movement
          translateX = diffX;
        }
        // If diffX >= 0, translateX stays at 0 (can't move right)
        
        // Apply transform for visual feedback
        menuRef.current.style.transform = `translateX(${translateX}px)`;
        menuRef.current.style.transition = 'none';
      }
      // If vertical, allow default scrolling behavior (don't preventDefault)
    };

    const handleTouchEnd = () => {
      if (!menuRef.current) return;
      
      if (swipeDirection.current === 'horizontal') {
        const swipeDistance = touchStartX.current - touchCurrentX.current;
        
        if (swipeDistance > 50) {
          // Swiped left more than 50px - animate off-screen from current position
          const menuWidth = menuRef.current.offsetWidth;
          
          setIsAnimatingClose(true);
          
          // Only animate transform, don't let CSS transition interfere
          menuRef.current.style.transition = 'transform 0.1s ease';
          menuRef.current.style.transform = `translateX(-${menuWidth}px)`;
          
          // Wait for animation to complete, then close menu
          setTimeout(() => {
            setIsMobileMenuOpen(false);
            
            // Reset after React has updated
            setTimeout(() => {
              if (menuRef.current) {
                menuRef.current.style.transform = '';
                menuRef.current.style.transition = '';
              }
              setIsAnimatingClose(false);
            }, 50);
          }, 100);
        } else {
          // Spring back to original position
          menuRef.current.style.transform = '';
          menuRef.current.style.transition = 'transform 0.15s ease';
          
          // Clear the transition after spring-back completes
          setTimeout(() => {
            if (menuRef.current) {
              menuRef.current.style.transition = '';
            }
          }, 150);
        }
      }
      
      isSwiping.current = false;
      swipeDirection.current = null;
    };

    const menuElement = menuRef.current;
    if (menuElement && isMobileMenuOpen) {
      menuElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      menuElement.addEventListener('touchmove', handleTouchMove, { passive: false }); // passive: false to allow preventDefault
      menuElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (menuElement) {
        menuElement.removeEventListener('touchstart', handleTouchStart);
        menuElement.removeEventListener('touchmove', handleTouchMove);
        menuElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Handle click outside to close menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClickOutside = (e) => {
        // Check if click is on the hamburger menu button or its children
        const isMenuButton = e.target.closest('.mobile-menu-button');
        
        if (!isMenuButton && menuRef.current && !menuRef.current.contains(e.target)) {
          setIsMobileMenuOpen(false);
        }
      };

      // Delay adding the listener to avoid the click that opened the menu from closing it
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside, true);
      };
    }
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  return (
    <nav 
      ref={menuRef} 
      className={`chapter-menu ${isMobileMenuOpen ? 'mobile-open' : ''} ${!isMenuVisible ? 'menu-hidden' : ''} ${isAnimatingClose ? 'animating-close' : ''}`}
    >
      <div className="menu-sticky-header">
        {onHome && (
          <>
            <div className="home-button-container">
              <button className="home-button" onClick={onHome}>
                ← Home
              </button>
            </div>
            <div className="home-button-container">
              <button className="home-button" onClick={() => {
                // Try to get last read article from localStorage
                const lastReadArticleStr = localStorage.getItem('lastReadArticle');
                
                if (lastReadArticleStr) {
                  try {
                    const lastReadArticle = JSON.parse(lastReadArticleStr);
                    const article = articles.find(a => a.id === lastReadArticle.articleId);
                    
                    // Verify the article still exists
                    if (article) {
                      navigate(`/articles/${article.slug}`);
                      return;
                    }
                  } catch (e) {
                    // If parsing fails, continue to default behavior
                  }
                }
                
                // Fallback to first article
                if (articles.length > 0) {
                  navigate(`/articles/${articles[0].slug}`);
                }
              }}>
                Articles
              </button>
            </div>
          </>
        )}
        <div className="menu-header">
          <h3 onClick={() => {
            const newValue = !isExpanded;
            setIsExpanded(newValue);
            localStorage.setItem('chaptersExpanded', JSON.stringify(newValue));
          }} style={{ cursor: 'pointer', userSelect: 'none' }}>
            Chapters <span className={`chevron ${isExpanded ? 'chevron-up' : 'chevron-down'}`}>›</span>
          </h3>
        </div>
      </div>
      <div className="menu-scrollable">
        <ul>
        {(() => {
          const groupedChapters = allChapters.reduce((acc, chapter) => {
            const partNum = chapter.part || 1;
            if (!acc[partNum]) acc[partNum] = [];
            acc[partNum].push(chapter);
            return acc;
          }, {});
          
          const romanNumerals = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };
          
          return Object.keys(groupedChapters).sort().map(partNum => (
            <li key={`part-${partNum}`} className="part-section">
              <div className="part-header">Part {romanNumerals[partNum] || partNum}</div>
              <ul className="chapters-in-part">
                {groupedChapters[partNum].map((chapter, chapterIdx) => {
                  const actualChapterIdx = allChapters.indexOf(chapter);
                  // Calculate darker gray for lower items (menu position based on actualChapterIdx)
                  const grayValue = 232 - (actualChapterIdx * 5); // Starts at 232 (#e8), gets darker
                  const hoverGrayValue = 240 - (actualChapterIdx * 5); // Slightly lighter for hover
                  const activeStyle = actualChapterIdx === currentChapterIndex ? {
                    background: '#000000',
                    color: '#ffffff'
                  } : {};
                  
                  const chapterStyle = {
                    ...activeStyle,
                    '--hover-gray': `rgb(${hoverGrayValue}, ${hoverGrayValue}, ${hoverGrayValue})`
                  };
                  
                  return (
                    <li key={chapter.id}>
                      <div className={`chapter-wrapper ${actualChapterIdx === currentChapterIndex ? 'active-chapter' : ''}`}>
                        <div
                          className={`chapter-title ${actualChapterIdx === currentChapterIndex ? 'active' : ''} ${chapter.available === false ? 'unavailable' : ''}`}
                          style={chapterStyle}
                          onClick={() => {
                            if (chapter.available !== false) {
                              onNavigate(actualChapterIdx, 0);
                              setIsMobileMenuOpen(false);
                            }
                          }}
                        >
                          {chapter.englishTitle}
                        </div>
                        {chapter.parts && (
                          <ul className={`part-menu ${!isExpanded ? 'collapsed' : ''}`}>
                          {chapter.parts.map((part, partIdx) => {
                            // Calculate gray for parts - even darker based on chapter + part index
                            const partGrayValue = 232 - (actualChapterIdx * 5) - (partIdx * 3);
                            const partHoverGrayValue = 240 - (actualChapterIdx * 5) - (partIdx * 3);
                            const partActiveStyle = actualChapterIdx === currentChapterIndex && partIdx === currentPartIndex ? {
                              background: '#ffffff',
                              color: '#000000',
                              border: '2px solid #000000'
                            } : {};
                            
                            const partStyle = {
                              ...partActiveStyle,
                              '--hover-gray': `rgb(${partHoverGrayValue}, ${partHoverGrayValue}, ${partHoverGrayValue})`
                            };
                            
                            return (
                              <li
                                key={partIdx}
                                className={`${actualChapterIdx === currentChapterIndex && partIdx === currentPartIndex ? 'active' : ''} ${part.available === false ? 'unavailable' : ''}`}
                                style={partStyle}
                                onClick={() => {
                                  if (part.available !== false) {
                                    onNavigate(actualChapterIdx, partIdx);
                                    setIsMobileMenuOpen(false);
                                  }
                                }}
                              >
                                {part.englishTitle}
                              </li>
                            );
                          })}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          ));
        })()}
      </ul>
      </div>
    </nav>
  );
}

export default ChapterMenu;
