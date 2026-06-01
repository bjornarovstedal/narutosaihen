import { useState, useEffect } from 'react';
import '../App.css';

const teams = [
  {
    name: "Leaf 16",
    village: "Konohagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/leaf16.png`,
    members: [
      { name: "Uzumaki Naruto" },
      { name: "Haruno Sakura" },
      { name: "Uchiha Sasuke", leader: true }
    ]
  },
  {
    name: "Leaf 15",
    village: "Konohagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/leaf15.png`,
    members: [
      { name: "Nara Shikamaru", leader: true  },
      { name: "Akimichi Chōji" },
      { name: "Yamanaka Ino"}
    ]
  },
  {
    name: "Leaf 14",
    village: "Konohagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/leaf14.png`,
    members: [
      { name: "Aburame Shino" },
      { name: "Hyūga Hinata" },
      { name: "Inuzuka Kiba", leader: true }
    ]
  },
  {
    name: "Leaf 13",
    village: "Konohagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/leaf13.png`,
    members: [
      { name: "Tenten" },
      { name: "Rock Lee" },
      { name: "Hyūga Neji", leader: true }
    ]
  },
  {
    name: "Sand 3",
    village: "Sunagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/sand3.png`,
    members: [
      { name: "Kankurō", leader: true },
      { name: "Gaara"},
      { name: "Temari" }
    ]
  },
  {
    name: "Sound 2",
    village: "Otogakure",
    image: `${process.env.PUBLIC_URL}/images/teams/sound2.png`,
    members: [
      { name: "Abumi Zaku", leader: true },
      { name: "Kinuta Dosu" },
      { name: "Tsuchi Kin" }
    ]
  },
  {
    name: "Grass 1 / \nLeaf 12",
    village: "Kusagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/grass1.png`,
    members: [
      { name: "Gōmonjō Yoroi" },
      { name: "Hana Shiore", leader: true },
      { name: "Misumi" }
    ]
  },
  {
    name: "Rain 4",
    village: "Amegakure",
    image: `${process.env.PUBLIC_URL}/images/teams/rain4.png`,
    members: [
      { name: "Maboroshi Shigure", leader: true },
      { name: "Yuie Baiu" },
      { name: "Oboro" }
    ]
  },
  {
    name: "Rain 5",
    village: "Amegakure",
    image: `${process.env.PUBLIC_URL}/images/teams/rain5.png`,
    members: [
      { name: "Tagi" },
      { name: "Daike", leader: true },
      { name: "Edadera Utabei" }
    ]
  },
  {
    name: "Stone 11",
    village: "Iwagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/stone11.png`,
    members: [
      { name: "Heiwa" },
      { name: "Enakiri Koishi" },
      { name: "Jinsoku", leader: true  }
    ]
  },
  {
    name: "Stone 13",
    village: "Iwagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/stone13.png`,
    members: [
      { name: "Isenishi Chinari", leader: true },
      { name: "Shinobaru Mawan" },
      { name: "Sekitsuki Yaki" }
    ]
  },
  {
    name: "Stone 14",
    village: "Iwagakure",
    image: `${process.env.PUBLIC_URL}/images/teams/stone14.png`,
    members: [
      { name: "Hatakino Nonso"},
      { name: "Asahira Shurei", leader: true },
      { name: "Tanirata Natsuni" }
    ]
  },
  {
    name: "Mist 7",
    village: "Kirigakure",
    image: `${process.env.PUBLIC_URL}/images/teams/mist7.png`,
    members: [
      { name: "Ichita Oriru"},
      { name: "Kurokite Kusu", leader: true },
      { name: "Igataki Yosaru" }
    ]
  },
  {
    name: "Mist 8",
    village: "Kirigakure",
    image: `${process.env.PUBLIC_URL}/images/teams/mist8.png`,
    members: [
      { name: "Suigetsu Seisuki"},
      { name: "Kurokite Tabe", leader: true },
      { name: "Matsumo Kora" }
    ]
  },
  {
    name: "Snow 1",
    village: "Yukigakure",
    image: `${process.env.PUBLIC_URL}/images/teams/snow1.png`,
    members: [
      { name: "Tsuto Fuyumi"},
      { name: "Tsuto Hairisa", leader: true },
      { name: "Tsuto Usaki" }
    ]
  },
  {
    name: "Cloud 11",
    village: "Kumogakure",
    image: `${process.env.PUBLIC_URL}/images/teams/cloud11.png`,
    members: [
      { name: "Ju"},
      { name: "Ke", leader: true },
      { name: "Ru" }
    ]
  }
  // Add all 16 teams with their respective image paths...
];

function TeamViewer() {
  const [currentTeam, setCurrentTeam] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [isHorizontalSwipe, setIsHorizontalSwipe] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitioningFromTeam, setTransitioningFromTeam] = useState(null);

  // Preload all team images
  useEffect(() => {
    teams.forEach(team => {
      const img = new Image();
      img.src = team.image;
    });
  }, []);

  const nextTeam = () => {
    setCurrentTeam((prev) => (prev + 1) % teams.length);
  };

  const prevTeam = () => {
    setCurrentTeam((prev) => (prev - 1 + teams.length) % teams.length);
  };

  // Touch event handlers for swipe navigation between teams
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    // Always stop propagation to prevent Chapter from handling touch events
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
      
      // Determine direction on first significant movement
      if (touchEnd === null && (diffX > 5 || diffY > 5)) {
        const isHorizontal = diffX > diffY;
        setIsHorizontalSwipe(isHorizontal);
        
        if (isHorizontal) {
          // Horizontal swipe - block vertical scrolling immediately
          e.preventDefault();
          e.stopPropagation();
          setTouchEnd(currentX); // Mark as valid for team navigation
        } else {
          // Vertical scroll - allow it but block team navigation
          setTouchEnd(-1); // Special marker to prevent team navigation
          return; // Don't process any team navigation logic
        }
      }
      
      // For already-determined horizontal swipes
      if (isHorizontalSwipe && touchEnd !== null && touchEnd !== -1) {
        e.preventDefault(); // Block vertical scrolling
        e.stopPropagation(); // Block Chapter navigation
        
        const currentOffset = currentX - touchStart;
        
        // Check boundaries and limit offset
        let limitedOffset = currentOffset;
        if (currentOffset > 0 && currentTeam === 0) {
          limitedOffset = 0; // No previous team, don't allow right swipe
        } else if (currentOffset < 0 && currentTeam === teams.length - 1) {
          limitedOffset = 0; // No next team, don't allow left swipe
        } else {
          // Limit the swipe offset to prevent excessive dragging
          limitedOffset = Math.max(-300, Math.min(300, currentOffset));
        }
        
        setSwipeOffset(limitedOffset);
        setTouchEnd(currentX);
      }
    }
  };

  const onTouchEnd = (e) => {
    // Always stop propagation to prevent Chapter navigation
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

    if (isLeftSwipe && currentTeam < teams.length - 1) {
      setTransitioningFromTeam(currentTeam);
      setIsTransitioning(true);
      // Animate the full width transition
      setSwipeOffset(-window.innerWidth);
      
      setTimeout(() => {
        // Change team
        nextTeam();
        // Use requestAnimationFrame to ensure all state updates happen together
        requestAnimationFrame(() => {
          setIsTransitioning(false);
          setTransitioningFromTeam(null);
          setSwipeOffset(0);
        });
      }, 300);
    } else if (isRightSwipe && currentTeam > 0) {
      setTransitioningFromTeam(currentTeam);
      setIsTransitioning(true);
      // Animate the full width transition
      setSwipeOffset(window.innerWidth);
      
      setTimeout(() => {
        // Change team
        prevTeam();
        // Use requestAnimationFrame to ensure all state updates happen together
        requestAnimationFrame(() => {
          setIsTransitioning(false);
          setTransitioningFromTeam(null);
          setSwipeOffset(0);
        });
      }, 300);
    } else {
      // Snap back if swipe was too short
      setSwipeOffset(0);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    setIsHorizontalSwipe(false);
  };
  
  // Use transitioning team data for previews if mid-transition, otherwise use current
  const teamIndexForPreviews = transitioningFromTeam !== null ? transitioningFromTeam : currentTeam;
  const team = teams[currentTeam];
  const prevTeamData = teamIndexForPreviews > 0 ? teams[teamIndexForPreviews - 1] : null;
  const nextTeamData = teamIndexForPreviews < teams.length - 1 ? teams[teamIndexForPreviews + 1] : null;

  return (
    <div 
      className="team-viewer"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Previous team preview */}
        {prevTeamData && (swipeOffset > 0 || (isTransitioning && swipeOffset !== 0)) && (
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
            <img src={prevTeamData.image} alt={prevTeamData.name} className="team-viewer-image" />
            
            <div className="team-counter" style={{ visibility: 'hidden' }}>{currentTeam + 1} / {teams.length}</div>
            
            <div className="team-header">
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>←</button>
              <h3>{prevTeamData.name}</h3>
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>→</button>
            </div>
            
            <div className="team-info">
              <div className="team-members">
                {prevTeamData.members.map((member, idx) => (
                  <div key={idx} className="team-member">
                    <span className={member.leader ? "member-name leader" : "member-name"}>
                      {member.name}
                    </span>
                    {member.role && <span className="member-role"> ({member.role})</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Current team */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Sliding content wrapper */}
          <div style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
          }}>
            <img src={team.image} alt={team.name} className="team-viewer-image" />
          </div>
          
          <div className="team-counter">{currentTeam + 1} / {teams.length}</div>
          
          <div className="team-header">
            <button onClick={prevTeam} className="nav-arrow" disabled={currentTeam === 0}>
              ←
            </button>
            
            <h3 style={{
              transform: `translateX(${swipeOffset}px)`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
            }}>{team.name}</h3>
            
            <button onClick={nextTeam} className="nav-arrow" disabled={currentTeam === teams.length - 1}>
              →
            </button>
          </div>
          
          <div className="team-info">
            <div style={{
              transform: `translateX(${swipeOffset}px)`,
              transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
            }}>
              <div className="team-members">
                {team.members.map((member, idx) => (
                  <div key={idx} className="team-member">
                    <span className={member.leader ? "member-name leader" : "member-name"}>
                      {member.name}
                    </span>
                    {member.role && <span className="member-role"> ({member.role})</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Next team preview */}
        {nextTeamData && (swipeOffset < 0 || (isTransitioning && swipeOffset !== 0)) && (
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
            <img src={nextTeamData.image} alt={nextTeamData.name} className="team-viewer-image" />
            
            <div className="team-counter" style={{ visibility: 'hidden' }}>{currentTeam + 1} / {teams.length}</div>
            
            <div className="team-header">
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>←</button>
              <h3>{nextTeamData.name}</h3>
              <button className="nav-arrow" style={{ visibility: 'hidden' }} disabled>→</button>
            </div>
            
            <div className="team-info">
              <div className="team-members">
                {nextTeamData.members.map((member, idx) => (
                  <div key={idx} className="team-member">
                    <span className={member.leader ? "member-name leader" : "member-name"}>
                      {member.name}
                    </span>
                    {member.role && <span className="member-role"> ({member.role})</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamViewer;