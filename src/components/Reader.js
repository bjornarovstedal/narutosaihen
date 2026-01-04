import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Chapter from './Chapter';
import Article from './Article';
import ChapterMenu from './ChapterMenu';

// Helper function to create URL slugs from titles
const createSlug = (text) => {
  return text.toLowerCase()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '') // Remove spaces
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};


// Combine all chapters from different story files and sort by id
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

function Reader() {
  const navigate = useNavigate();
  const { chapterSlug, partSlug } = useParams();
  
  // Persistent menu state (doesn't reset on chapter change)
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('chaptersExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const preserveScrollRef = useRef(false);
  
  // Find chapter and part by slugs - memoize to avoid recalculation
  const findBySlug = () => {
    if (!chapterSlug) return { chapterIndex: 0, partIndex: 0 };
    
    console.log('Looking for chapter with slug:', chapterSlug);
    console.log('All chapters:', allChapters.map(ch => ({ id: ch.id, title: ch.englishTitle, slug: createSlug(ch.englishTitle) })));
    
    const chapterIndex = allChapters.findIndex(ch => 
      createSlug(ch.englishTitle) === chapterSlug
    );
    
    console.log('Found chapter index:', chapterIndex);
    
    if (chapterIndex === -1) return { chapterIndex: 0, partIndex: 0 };
    
    let partIndex = 0;
    if (partSlug && allChapters[chapterIndex].parts) {
      const foundPartIndex = allChapters[chapterIndex].parts.findIndex(p => 
        createSlug(p.englishTitle) === partSlug
      );
      if (foundPartIndex !== -1) partIndex = foundPartIndex;
    }
    
    return { chapterIndex, partIndex };
  };
  
  // Initialize state directly from URL slugs to avoid flicker
  const [currentChapterIndex, setCurrentChapterIndex] = useState(() => findBySlug().chapterIndex);
  const [currentPartIndex, setCurrentPartIndex] = useState(() => findBySlug().partIndex);
  const currentChapter = allChapters[currentChapterIndex];
  
  console.log('Current chapter index:', currentChapterIndex);
  console.log('Current chapter:', currentChapter);
  console.log('Current part index:', currentPartIndex);
  
  // Update state when URL changes (for browser back/forward navigation)
  useEffect(() => {
    const newState = findBySlug();
    console.log('URL changed, updating to:', newState);
    
    setCurrentChapterIndex(prev => newState.chapterIndex !== prev ? newState.chapterIndex : prev);
    setCurrentPartIndex(prev => newState.partIndex !== prev ? newState.partIndex : prev);
  }, [chapterSlug, partSlug]);
  
  // Save last viewed chapter to localStorage
  useEffect(() => {
    const chapterSlugUrl = createSlug(currentChapter.englishTitle);
    const partSlugUrl = currentChapter.parts?.[currentPartIndex] ? 
      createSlug(currentChapter.parts[currentPartIndex].englishTitle) : null;
    
    const lastRead = {
      chapterSlug: chapterSlugUrl,
      partSlug: partSlugUrl,
      chapterId: currentChapter.id
    };
    
    localStorage.setItem('lastReadChapter', JSON.stringify(lastRead));
  }, [currentChapterIndex, currentPartIndex, currentChapter]);
  
  // Update URL when navigating without slug parameters
  useEffect(() => {
    if (!chapterSlug) {
      const chapterSlugUrl = createSlug(currentChapter.englishTitle);
      const partSlugUrl = currentChapter.parts?.[currentPartIndex] ? 
        createSlug(currentChapter.parts[currentPartIndex].englishTitle) : null;
      
      if (partSlugUrl) {
        navigate(`/${chapterSlugUrl}/${partSlugUrl}`, { replace: true });
      } else {
        navigate(`/${chapterSlugUrl}`, { replace: true });
      }
    }
  }, []);
  
  const handleNavigation = (chapterIndex, partIndex = 0, preserveScrollPos = false) => {
    const chapter = allChapters[chapterIndex];
    const chapterSlugUrl = createSlug(chapter.englishTitle);
    
    // Set preserve scroll flag in ref
    preserveScrollRef.current = preserveScrollPos;
    
    // Update state first
    setCurrentChapterIndex(chapterIndex);
    setCurrentPartIndex(partIndex);
    
    // Then update URL
    if (chapter.parts && chapter.parts[partIndex]) {
      const partSlugUrl = createSlug(chapter.parts[partIndex].englishTitle);
      navigate(`/${chapterSlugUrl}/${partSlugUrl}`, { replace: true });
    } else {
      navigate(`/${chapterSlugUrl}`, { replace: true });
    }
  };
  
  const handlePartChange = (partIndex, preserveScrollPos = false) => {
    const chapter = allChapters[currentChapterIndex];
    const chapterSlugUrl = createSlug(chapter.englishTitle);
    
    // Set preserve scroll flag in ref
    preserveScrollRef.current = preserveScrollPos;
    
    // Update state first
    setCurrentPartIndex(partIndex);
    
    // Then update URL
    if (chapter.parts && chapter.parts[partIndex]) {
      const partSlugUrl = createSlug(chapter.parts[partIndex].englishTitle);
      navigate(`/${chapterSlugUrl}/${partSlugUrl}`, { replace: true });
    }
  };
  
  const handleHome = () => {
    navigate('/');
  };
  
  // Check if this slug is actually an article (after all hooks)
  if (chapterSlug && !partSlug) {
    const isArticle = articles.some(a => a.slug === chapterSlug);
    if (isArticle) {
      return <Article />;
    }
  }
  
  return (
    <>
      <ChapterMenu
        allChapters={allChapters}
        currentChapterIndex={currentChapterIndex}
        currentPartIndex={currentPartIndex}
        onNavigate={handleNavigation}
        onHome={handleHome}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMenuVisible={isMenuVisible}
      />
      <Chapter 
        englishTitle={currentChapter.englishTitle}
        romanizedTitle={currentChapter.romanizedTitle}
        kanjiTitle={currentChapter.kanjiTitle}
        content={currentChapter.content} 
        images={currentChapter.images}
        parts={currentChapter.parts}
        allChapters={allChapters}
        currentChapterIndex={currentChapterIndex}
        currentPartIndex={currentPartIndex}
        onNavigate={handleNavigation}
        onPartChange={handlePartChange}
        onHome={handleHome}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isMenuVisible={isMenuVisible}
        setIsMenuVisible={setIsMenuVisible}
        preserveScrollRef={preserveScrollRef}
      />
    </>
  );
}

export default Reader;