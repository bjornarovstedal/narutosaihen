import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { updates } from '../data/Updates.js';
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

const createSlug = (text) => {
  return text.toLowerCase()
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '')
    .replace(/-+/g, '-');
};

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

function LandingPage() {
  const navigate = useNavigate();
  const [updatesExpanded, setUpdatesExpanded] = useState(false);
  const [aboutVariantIndex] = useState(() => Math.floor(Math.random() * 5));
  const navigateToWhyNarutoSaihen = () => navigate('/articles/whynarutosaihen');

  const aboutVariants = [
    () => (
      <>
        A fan-rewrite that may or may not be for you.{' '}
        <span className="about-link" onClick={navigateToWhyNarutoSaihen}>
          Find out here
        </span>.
      </>
    ),
    () => (
      <>
        <span className="about-link" onClick={navigateToWhyNarutoSaihen}>
          再 (sai) = ‘again’, ‘re’- + 編 (hen) = ‘compilation’, ‘editing’, ‘arrangement’
        </span>.
      </>
    ),
    () => (
      <>
        Taking the story of Naruto and{' '}
        <span className="about-link" onClick={navigateToWhyNarutoSaihen}>
          slowing it down
        </span>
        .
      </>
    ),
    () => (
      <>
        Something that is <em>different</em> to the original series.{' '}
        <span className="about-link" onClick={navigateToWhyNarutoSaihen}>
          See how
        </span>.
      </>
    ),
    () => (
      <>
        A{' '}
        <span className="about-link" onClick={navigateToWhyNarutoSaihen}>
          more grounded
        </span>{' '}
        retelling of Naruto.
      </>
    ),
  ];
  
  return (
    <div className="landing-page">
      <div className="landing-content">
        <img 
          src={`${process.env.PUBLIC_URL}/images/konohaLeafHQ.png`}
          alt="Konoha Leaf Symbol" 
          className="landing-leaf-symbol"
        />
        
        <h1 className="landing-title">Naruto: Saihen</h1>
        <p className="landing-kanji">再 編</p>
        
        <section className="about-section" style={{ marginBottom: '2.5rem' }}>
          <p>{aboutVariants[aboutVariantIndex]()}</p>
        </section>
        
        <button className="enter-button" style={{ marginBottom: '2.5rem' }} onClick={() => {
          // Try to get last read chapter from localStorage
          const lastReadStr = localStorage.getItem('lastReadChapter');
          
          if (lastReadStr) {
            try {
              const lastRead = JSON.parse(lastReadStr);
              const chapter = allChapters.find(ch => ch.id === lastRead.chapterId);
              
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
              // If parsing fails, continue to default behavior
            }
          }
          
          // Fallback to first available chapter
          const firstAvailableChapter = allChapters.find(ch => ch.available !== false);
          if (firstAvailableChapter) {
            const slug = createSlug(firstAvailableChapter.englishTitle);
            navigate(`/${slug}`);
          }
        }}>
          Read
        </button>
        
        <section className="updates-section">
          <h2 onClick={() => setUpdatesExpanded(!updatesExpanded)} style={{ cursor: 'pointer', userSelect: 'none' }}>
            Recent Updates <span className={`chevron ${updatesExpanded ? 'chevron-up' : 'chevron-down'}`}>›</span>
          </h2>
          <div className="updates-list">
            {(updatesExpanded ? updates : updates.slice(0, 3)).map((update, index) => (
              <div 
                key={index} 
                className={`update-item update-${update.type} ${update.chapterSlug || update.articleSlug || update.compendiumSlug ? 'update-clickable' : ''}`}
                onClick={() => {
                  if (update.chapterSlug) {
                    navigate(`/${update.chapterSlug}`);
                  } else if (update.articleSlug) {
                    navigate(`/articles/${update.articleSlug}`);
                  } else if (update.compendiumSlug) {
                    navigate(`/compendium/${update.compendiumSlug}`);
                  }
                }}
              >
                <span className="update-date">{new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="update-type">
                  {update.type === 'bugfix' ? 'Bug Fix 🐛' : update.type}
                </span>
                <span className="update-description">{update.description}</span>
              </div>
            ))}
          </div>
          {updates.length > 3 && (
            <div 
              style={{ textAlign: 'center', padding: '1rem 0', color: '#888888', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setUpdatesExpanded(!updatesExpanded)}
            >
              {updatesExpanded ? 'Hide' : `${updates.length - 3} more change${updates.length - 3 !== 1 ? 's' : ''}`}
            </div>
          )}
        </section>
        
        <div style={{ textAlign: 'center', padding: '2rem 0 1rem', color: '#888888', fontSize: '0.85rem' }}>
          narutosaihen@proton.me
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
