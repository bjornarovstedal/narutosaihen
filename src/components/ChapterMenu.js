import { useNavigate } from 'react-router-dom';
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

  return (
    <nav className={`chapter-menu ${isMobileMenuOpen ? 'mobile-open' : ''} ${!isMenuVisible ? 'menu-hidden' : ''}`}>
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
                      navigate(`/article/${article.slug}`);
                      return;
                    }
                  } catch (e) {
                    // If parsing fails, continue to default behavior
                  }
                }
                
                // Fallback to first article
                if (articles.length > 0) {
                  navigate(`/article/${articles[0].slug}`);
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
