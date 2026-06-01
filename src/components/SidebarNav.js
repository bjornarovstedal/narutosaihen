import { useNavigate } from 'react-router-dom';
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
import { articles } from '../data/articles/WhyNarutoSaihen';

const createSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-');

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
  ...aftermath,
].sort((a, b) => a.id - b.id);

/**
 * Renders the fixed-order sidebar navigation buttons used across the
 * Chapters (Reader), Articles, and Compendium pages.
 *
 * Pass `active` as one of: 'chapters' | 'articles' | 'compendium' to
 * highlight the current page. The active button is rendered in the
 * filled (black) style and is a no-op on click.
 */
function SidebarNav({ active }) {
  const navigate = useNavigate();

  const goChapters = () => {
    const lastReadStr = localStorage.getItem('lastReadChapter');
    if (lastReadStr) {
      try {
        const lastRead = JSON.parse(lastReadStr);
        const chapter = allChapters.find((ch) => ch.id === lastRead.chapterId);
        if (chapter && chapter.available !== false) {
          if (lastRead.partSlug) {
            navigate(`/${lastRead.chapterSlug}/${lastRead.partSlug}`);
          } else {
            navigate(`/${lastRead.chapterSlug}`);
          }
          return;
        }
      } catch (e) {
        // fall through to default
      }
    }

    const firstAvailable = allChapters.find((ch) => ch.available !== false);
    if (firstAvailable) {
      const slug = createSlug(firstAvailable.englishTitle);
      if (firstAvailable.parts && firstAvailable.parts.length > 0) {
        const partSlug = createSlug(firstAvailable.parts[0].englishTitle);
        navigate(`/${slug}/${partSlug}`);
      } else {
        navigate(`/${slug}`);
      }
    }
  };

  const goArticles = () => {
    const lastReadStr = localStorage.getItem('lastReadArticle');
    if (lastReadStr) {
      try {
        const lastRead = JSON.parse(lastReadStr);
        const article = articles.find((a) => a.id === lastRead.articleId);
        if (article) {
          navigate(`/articles/${article.slug}`);
          return;
        }
      } catch (e) {
        // fall through to default
      }
    }
    if (articles.length > 0) {
      navigate(`/articles/${articles[0].slug}`);
    }
  };

  const goCompendium = () => navigate('/compendium');

  const renderButton = (key, label, handler) => {
    const isActive = active === key;
    return (
      <div className="home-button-container">
        <button
          className={`home-button${isActive ? ' active' : ''}`}
          onClick={isActive ? undefined : handler}
        >
          {label}
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="home-button-container">
        <button className="home-button" onClick={() => navigate('/')}>
          ← Home
        </button>
      </div>
      {renderButton('chapters', 'Chapters', goChapters)}
      {renderButton('articles', 'Articles', goArticles)}
      {renderButton('compendium', 'Compendium', goCompendium)}
    </>
  );
}

export default SidebarNav;
