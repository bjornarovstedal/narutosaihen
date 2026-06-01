import { useState, useEffect } from 'react';
import './Chapter.css';

/**
 * Mobile swipeable viewer for hand seals.
 * Mirrors the TeamViewer pattern (touch handling, transitions, previews).
 * `seals` is an array of seal keys (e.g. 'horse'); `info` maps key -> { subtitle, description }.
 */
function HandSealViewer({ seals, info }) {
  const [currentSeal, setCurrentSeal] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitioningFromSeal, setTransitioningFromSeal] = useState(null);

  // Preload all seal images
  useEffect(() => {
    seals.forEach((seal) => {
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/images/hand_seals/${seal}.png`;
    });
  }, [seals]);

  const nextSeal = (e) => {
    if (e) e.stopPropagation();
    setCurrentSeal((prev) => (prev + 1) % seals.length);
  };

  const prevSeal = (e) => {
    if (e) e.stopPropagation();
    setCurrentSeal((prev) => (prev - 1 + seals.length) % seals.length);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    e.stopPropagation();
    if (isTransitioning) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setSwipeOffset(0);
    setIsHorizontalSwipe(false);
  };

  const onTouchMove = (e) => {
    if (isTransitioning) return;

    if (touchStart !== null && touchStartY !== null) {
      const currentX = e.targetTouches[0].clientX;
      const currentY = e.targetTouches[0].clientY;
      const diffX = Math.abs(currentX - touchStart);
      const diffY = Math.abs(currentY - touchStartY);

      if (touchEnd === null && (diffX > 5 || diffY > 5)) {
        const isHorizontal = diffX > diffY;
        setIsHorizontalSwipe(isHorizontal);

        if (isHorizontal) {
          e.preventDefault();
          e.stopPropagation();
          setTouchEnd(currentX);
        } else {
          setTouchEnd(-1);
          return;
        }
      }

      if (isHorizontalSwipe && touchEnd !== null && touchEnd !== -1) {
        e.preventDefault();
        e.stopPropagation();

        const currentOffset = currentX - touchStart;

        let limitedOffset = currentOffset;
        if (currentOffset > 0 && currentSeal === 0) {
          limitedOffset = 0;
        } else if (currentOffset < 0 && currentSeal === seals.length - 1) {
          limitedOffset = 0;
        } else {
          limitedOffset = Math.max(-300, Math.min(300, currentOffset));
        }

        setSwipeOffset(limitedOffset);
        setTouchEnd(currentX);
      }
    }
  };

  const onTouchEnd = (e) => {
    e.stopPropagation();

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

    if (isLeftSwipe && currentSeal < seals.length - 1) {
      setTransitioningFromSeal(currentSeal);
      setIsTransitioning(true);
      setSwipeOffset(-window.innerWidth);

      setTimeout(() => {
        nextSeal();
        requestAnimationFrame(() => {
          setIsTransitioning(false);
          setTransitioningFromSeal(null);
          setSwipeOffset(0);
        });
      }, 300);
    } else if (isRightSwipe && currentSeal > 0) {
      setTransitioningFromSeal(currentSeal);
      setIsTransitioning(true);
      setSwipeOffset(window.innerWidth);

      setTimeout(() => {
        prevSeal();
        requestAnimationFrame(() => {
          setIsTransitioning(false);
          setTransitioningFromSeal(null);
          setSwipeOffset(0);
        });
      }, 300);
    } else {
      setSwipeOffset(0);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsHorizontalSwipe(false);
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const sealAt = (i) => {
    const key = seals[i];
    return {
      key,
      name: capitalize(key),
      image: `${process.env.PUBLIC_URL}/images/hand_seals/${key}.png`,
      info: info[key],
    };
  };

  const indexForPreviews = transitioningFromSeal !== null ? transitioningFromSeal : currentSeal;
  const seal = sealAt(currentSeal);
  const prevSealData = indexForPreviews > 0 ? sealAt(indexForPreviews - 1) : null;
  const nextSealData = indexForPreviews < seals.length - 1 ? sealAt(indexForPreviews + 1) : null;

  const renderInfo = (data) => (
    <div className="team-info">
      <div className="team-members">
        {data.info && (
          <>
            <div className="hand-seal-mobile-subtitle">{data.info.subtitle}</div>
            <p className="hand-seal-mobile-description">{data.info.description}</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="team-viewer" style={{ position: 'relative', overflow: 'hidden' }}>
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {/* Previous preview */}
        {prevSealData && (swipeOffset > 0 || (isTransitioning && swipeOffset !== 0)) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              pointerEvents: 'none',
              zIndex: 1,
              transform: `translateX(${swipeOffset - window.innerWidth}px)`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            <img src={prevSealData.image} alt={prevSealData.name} className="team-viewer-image" />
            <div className="team-counter" style={{ visibility: 'hidden' }}>
              {currentSeal + 1} / {seals.length}
            </div>
            <div className="team-header">
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>←</button>
              <h3>{prevSealData.name}</h3>
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>→</button>
            </div>
            {renderInfo(prevSealData)}
          </div>
        )}

        {/* Current */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              transform: `translateX(${swipeOffset}px)`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            <img src={seal.image} alt={seal.name} className="team-viewer-image" />
          </div>

          <div className="team-counter">
            {currentSeal + 1} / {seals.length}
          </div>

          <div className="team-header">
            <button
              onClick={prevSeal}
              className="nav-arrow"
              disabled={currentSeal === 0}
              style={{ touchAction: 'manipulation' }}
            >
              ←
            </button>
            <h3
              style={{
                transform: `translateX(${swipeOffset}px)`,
                transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
              }}
            >
              {seal.name}
            </h3>
            <button
              onClick={nextSeal}
              className="nav-arrow"
              disabled={currentSeal === seals.length - 1}
              style={{ touchAction: 'manipulation' }}
            >
              →
            </button>
          </div>

          <div
            style={{
              transform: `translateX(${swipeOffset}px)`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            {renderInfo(seal)}
          </div>
        </div>

        {/* Next preview */}
        {nextSealData && (swipeOffset < 0 || (isTransitioning && swipeOffset !== 0)) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              pointerEvents: 'none',
              zIndex: 1,
              transform: `translateX(${swipeOffset + window.innerWidth}px)`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
            }}
          >
            <img src={nextSealData.image} alt={nextSealData.name} className="team-viewer-image" />
            <div className="team-counter" style={{ visibility: 'hidden' }}>
              {currentSeal + 1} / {seals.length}
            </div>
            <div className="team-header">
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>←</button>
              <h3>{nextSealData.name}</h3>
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>→</button>
            </div>
            {renderInfo(nextSealData)}
          </div>
        )}
      </div>
    </div>
  );
}

export default HandSealViewer;
