import React, { useState, useEffect } from 'react';
import InteractiveImage from './InteractiveImage';

// Reusable circular checkbox component
const CircularCheckbox = ({ checked, onChange, size = 22, isMobile = false }) => {
  const actualSize = isMobile ? 16 : size;
  
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          appearance: 'none',
          width: `${actualSize}px`,
          height: `${actualSize}px`,
          borderRadius: '50%',
          border: '2px solid #000',
          display: 'inline-block',
          margin: 0,
          outline: 'none',
          position: 'relative',
          verticalAlign: 'middle',
          cursor: 'pointer',
        }}
      />
      {/* Custom checkmark */}
      {checked && (
        <svg
          width={actualSize}
          height={actualSize}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            left: 0,
            top: 0,
            transform: 'translate(2px, 2px)',
          }}
        >
          <circle
            cx={isMobile ? 6 : actualSize / 2.5}
            cy={isMobile ? 6 : actualSize / 2.5}
            r={isMobile ? 5 : actualSize / 2.75}
            fill="none"
            strokeWidth="2"
          />
          <polyline
            points={isMobile ? "3,6.5 5.5,9 10,4" : `${actualSize * 0.23},${actualSize * 0.45} ${actualSize * 0.36},${actualSize * 0.59} ${actualSize * 0.64},${actualSize * 0.27}`}
            fill="none"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </label>
  );
};

const names = [
    { label: "Mist 8", img: `${process.env.PUBLIC_URL}/images/teams/mist8.png` , members: ["Suigetsu Seisuki", "Kurokite Tabe", "Matsumo Kora"], leader: "Kurokite Tabe", color: "#1e90ff", paths: [
      {
        members: ["Suigetsu Seisuki", "Kurokite Tabe", "Matsumo Kora"],
        color: "#a8cee0ff",
        curves: [
          { controlX: 210, controlY: 50, endX: 210, endY: 120 },
          { controlX: 210, controlY: 130, endX: 240, endY: 200 },
          { controlX: 480, controlY: 120, endX: 350, endY: 340 },
          { controlX: 350, controlY: 370, endX: 390, endY: 430 },
          { controlX: 430, controlY: 430, endX: 430, endY: 420 },
          { controlX: 410, controlY: 400, endX: 410, endY: 400 }
        ]
      }
    ]},
    
    { label: "Stone 14", img: `${process.env.PUBLIC_URL}/images/teams/stone14.png`, members: ["Hatakino Nonso", "Asahira Shurei", "Tanirata Natsuni"], leader: "Asahira Shurei", color: "#a0522d", paths: [
      {
        members: ["Hatakino Nonso", "Asahira Shurei", "Tanirata Natsuni"],
        color: "#8a3621ff",
        curves: [
          { controlX: 390, controlY: 50, endX: 350, endY: 100 }
        ]
      }
    ]},

    { label: "Leaf 16", img: `${process.env.PUBLIC_URL}/images/teams/leaf16.png`, members: ["Uzumaki Naruto", "Haruno Sakura", "Uchiha Sasuke"], leader: "Uchiha Sasuke", color: "#228b22", paths: [
      {
          members: ["Uzumaki Naruto", "Haruno Sakura", "Uchiha Sasuke"],
          color: "#1ea858ff",
          curves: [
            { controlX: 450, controlY: 160, endX: 430, endY: 140 },
            { 
                controlX: 380, controlY: 100, endX: 340, endY: 150,
                branches: [
                {
                  members: ["Uzumaki Naruto"],
                  color: "#1ea858ff",
                  curves: [
                    { controlX: 500, controlY: 150, endX: 420, endY: 220 },
                    { controlX: 360, controlY: 260, endX: 380, endY: 300 },
                    { controlX: 390, controlY: 320, endX: 418, endY: 290 }
                  ]
                }
                ]
            },
          ]
      },
      {
        members: ["Haruno Sakura", "Uchiha Sasuke"],
        color: "#1ea858ff",
        curves: [
          { controlX: 500, controlY: 200, endX: 450, endY: 230 },
          { controlX: 400, controlY: 265, endX: 420, endY: 290 }
        ]
      },
      {
        members: ["Uzumaki Naruto", "Haruno Sakura", "Uchiha Sasuke"],
        color: "#1ea858ff",
        curves: [
          { controlX: 370, controlY: 250, endX: 350, endY: 220 },
          { controlX: 330, controlY: 180, endX: 300, endY: 210 }
        ]
      },
      {
        members: ["Uzumaki Naruto", "Haruno Sakura", "Uchiha Sasuke"],
        color: "#1ea858ff",
        curves: [
          { controlX: 350, controlY: 280, endX: "tower", endY: "tower" }
        ]
      },
    ]},

    { label: "Stone 13", img: `${process.env.PUBLIC_URL}/images/teams/stone13.png`, members: ["Isenishi Chinari", "Shinobaru Mawan", "Sekitsuki Yaki"], leader: "Isenishi Chinari", color: "#d2691e", pathControl: {curve: -20}}, 
    { label: "Rain 5", img: `${process.env.PUBLIC_URL}/images/teams/rain5.png`, members: ["Tagi", "Daike", "Edadera Utabei"], leader: "Daike", color: "#4682b4", pathControl: {curve: 0}}, 
    { label: "Leaf 15", img: `${process.env.PUBLIC_URL}/images/teams/leaf15.png`, members: ["Naru Shikamaru", "Akimichi Chōji", "Yamanaka Ino"], leader: "Naru Shikamaru", color: "#ff4500", pathControl: {curve: 20}}, 
    { label: "Grass 1 / Leaf 12", img: `${process.env.PUBLIC_URL}/images/teams/grass1.png`, members: ["Gōmonjō Yoroi", "Hana Shiore", "Misumi"], leader: "Hana Shiore", color: "#32cd32", pathControl: {curve: 40}}, 
    { label: "Stone 11", img: `${process.env.PUBLIC_URL}/images/teams/stone11.png`, members: ["Heiwa", "Enakiri Koishi", "Jinsoku"], leader: "Jinsoku", color: "#d3d3d3", pathControl: {curve: 60}}, 
    { label: "Cloud 11", img: `${process.env.PUBLIC_URL}/images/teams/cloud11.png`, members: ["Ju", "Ke", "Ru"], leader: "Ke", color: "#add8e6", pathControl: {curve: 80}}, 
    { label: "Sound 2", img: `${process.env.PUBLIC_URL}/images/teams/sound2.png`, members: ["Abumi Zaku", "Kinuta Dosu", "Tsuchi Kin"], leader: "Abumi Zaku", color: "#ffb6c1", pathControl: {curve: 100}}, 
    { label: "Leaf 13", img: `${process.env.PUBLIC_URL}/images/teams/leaf13.png`, members: ["Tenten", "Rock Lee", "Hyūga Neji"], leader: "Hyūga Neji", color: "#ff69b4", pathControl: {curve: 120}}, 
    { label: "Snow 1", img: `${process.env.PUBLIC_URL}/images/teams/snow1.png`, members: ["Tsuto Fuyumi", "Tsuto Hairisa", "Tsuto Usaki"], leader: "Tsuto Hairisa", color: "#ffffff", pathControl: {curve: 140}}, 
    { label: "Leaf 14", img: `${process.env.PUBLIC_URL}/images/teams/leaf14.png`, members: ["Aburame Shino", "Hyūga Hinata", "Inuzuka Kiba"], leader: "Inuzuka Kiba", color: "#ffdead", paths: [
      {
        members: ["Aburame Shino", "Hyūga Hinata", "Inuzuka Kiba"],
        color: "#1ea858ff",
        curves: [
            { controlX: 150, controlY: 300, endX: 170, endY: 270 }
        ]
      }
    ]},

    { label: "Mist 7", img: `${process.env.PUBLIC_URL}/images/teams/mist7.png`, members: ["Ichita Oriru", "Kurokite Kusu", "Igataki Yosaru"], leader: "Kurokite Kusu", color: "#1e90ff", paths: [
      {
        members: ["Ichita Oriru", "Kurokite Kusu", "Igataki Yosaru"],
        color: "#a8cee0ff",
        curves: [
          { controlX: 50, controlY: 250, endX: 90, endY: 295 },
        ]
      }
    ]},

    { label: "Sand 3", img: `${process.env.PUBLIC_URL}/images/teams/sand3.png`, members: ["Kankurō", "Gaara", "Temari"], leader: "Kankurō", color: "#deb887", paths: [
      {
        members: ["Kankurō", "Gaara", "Temari"],
        color: "#deb887",
        curves: [
          { controlX: 110, controlY: 120, endX: 203, endY: 250 },
          { controlX: 260, controlY: 340, endX: 300, endY: 310 }
        ]
      }
    ]},

    { label: "Rain 4", img: `${process.env.PUBLIC_URL}/images/teams/rain4.png`, members: ["Maboroshi Shigure", "Yuie Baiu", "Oboro"], leader: "Maboroshi Shigure", color: "#4682b4", paths: [
        {
          members: ["Maboroshi Shigure", "Oboro", "Yuie Baiu"],
          color: "#1e4b86ff",
          curves: [
            { controlX: 200, controlY: 50, endX: 250, endY: 80,
            branches: [
              {
                members: ["Yuie Baiu"],
                color: "#1e4b86ff",
                curves: [
                  { controlX: 300, controlY: 80, endX: 350, endY: 100 },
                  { controlX: 360, controlY: 100, endX: 340, endY: 150 }
                ]
              }
            ]}
          ]
        },
        {
          members: ["Maboroshi Shigure", "Oboro"],
          color: "#1e4b86ff",
          curves: [
            { controlX: 350, controlY: 150, endX: 340, endY: 150 }
          ]
        },
        {
          members: ["Maboroshi Shigure", "Oboro", "Yuie Baiu"],
          color: "#1e4b86ff",
          curves: [
            { controlX: 180, controlY: 170, endX: 185, endY: 230 },
            { controlX: 100, controlY: 300, endX: 140, endY: 410 },
            { controlX: 200, controlY: 230, endX: 299, endY: 210 }
          ]
        }
    ]}
];

function ForestOfDeathPerimeterImage({ src, alt, info }) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  
  // Update window width on resize
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Preload all team images when component mounts
  useEffect(() => {
    names.forEach(team => {
      const img = new Image();
      img.src = team.img;
    });
    console.log(`Preloading ${names.length} team images for Forest of Death`);
  }, []);
  
  // Adjust size and scale based on screen width
  const isMobile = windowWidth <= 768;
  const baseSize = 600; // Original design size
  const size = isMobile ? Math.min(windowWidth * 0.60, 350) : 600;
  const coordScale = size / baseSize; // Scale factor for coordinates
  const mapRadius = 278 * coordScale;
  const nameRadius = 350 * coordScale;
  const center = size / 2;
  const [hoveredPath, setHoveredPath] = useState(null); // {teamIdx, pathIdx, members, x, y}
  const [hoveredIdx, setHoveredIdx] = useState(null);   // <-- Add this line
  const scale = 1.25;

  // Path visibility state
  const [visiblePaths, setVisiblePaths] = useState(
    names.reduce((acc, team, i) => ({ ...acc, [i]: true }), {})
  );

  const handleToggle = idx => {
    setVisiblePaths(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Recursive renderer for branches only (for main path, we use a single <path>)
    function renderBranches({ curves, startX, startY, color, thickness }) {
        let prevX = startX;
        let prevY = startY;
        const elements = [];

        curves.forEach((curve) => {
        const endX = curve.endX === 'tower' ? center : curve.endX * coordScale;
        const endY = curve.endY === 'tower' ? center : curve.endY * coordScale;
        // Render branches if any
        if (curve.branches && Array.isArray(curve.branches)) {
            curve.branches.forEach((branch, branchIdx) => {
            let branchD = `M ${endX} ${endY}`;
            let branchPrevX = endX;
            let branchPrevY = endY;
            (branch.curves || []).forEach((bcurve) => {
                const bendX = bcurve.endX === 'tower' ? center : bcurve.endX * coordScale;
                const bendY = bcurve.endY === 'tower' ? center : bcurve.endY * coordScale;
                branchD += ` Q ${bcurve.controlX * coordScale} ${bcurve.controlY * coordScale}, ${bendX} ${bendY}`;
                branchPrevX = bendX;
                branchPrevY = bendY;
            });

            // Tooltip label for branch
            let branchLabel = "";
            if (Array.isArray(branch.members) && branch.members.length > 0) {
                branchLabel = branch.members.join(", ");
            } else if (typeof branch.member === "string") {
                branchLabel = branch.member;
            } else {
                branchLabel = "";
            }

            // Thickness based on number of members in branch
            const branchThickness = (Array.isArray(branch.members) && branch.members.length > 0
                ? branch.members.length * 4
                : 4) * coordScale;

            elements.push(
                <path
                key={Math.random()}
                d={branchD}
                stroke={branch.color ?? color}
                strokeWidth={branchThickness}
                fill="none"
                opacity={1}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                onMouseEnter={e => {
                    setHoveredPath({
                    members: branchLabel,
                    color: branch.color ?? color,
                    });
                }}
                onMouseMove={e => {
                    const svgRect = e.target.ownerSVGElement.getBoundingClientRect();
                    setMousePos({
                    x: (e.clientX - svgRect.left) / scale,
                    y: (e.clientY - svgRect.top) / scale,
                    });
                }}
                onMouseLeave={() => setHoveredPath(null)}
                />
            );
            });
        }
        prevX = endX;
        prevY = endY;
        });

        return elements;
    }

  // Mouse position state for tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          margin: '15rem auto 2rem auto',
          overflow: 'visible',
        }}
      >
        {/* Map image */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              display: 'block',
              objectFit: 'contain',
            }}
          />
        </div>

       {/* Show All checkbox placed above entire map (including team names) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: `${center - nameRadius - 120}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 60,
            pointerEvents: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative',
              padding: 20,
              background: 'transparent',
            }}
          >
            <CircularCheckbox
              checked={Object.values(visiblePaths).every(Boolean)}
              onChange={() => {
                const allVisible = Object.values(visiblePaths).every(Boolean);
                setVisiblePaths(
                  names.reduce((acc, _team, i) => ({ ...acc, [i]: !allVisible }), {})
                );
              }}
              size={28}
              isMobile={isMobile}
            />
            <span
              style={{
                fontWeight: 'bold',
                fontSize: isMobile ? '0.66rem' : '1.2rem',
                padding: '2px 8px',
                zIndex: 2,
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                textAlign: 'center',
                lineHeight: '1.2',
              }}
            >
              Show All
            </span>
          </div>
        </div>

        {/* Overlays */}
        <div
          style={{
            width: size,
            height: size,
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {/* Tower overlay: small image centered, scaled by same scale factor.
            towerPercent is the % of the map's box the tower should occupy (tweak as needed). */}
        {(() => {
          const towerPercent = 14; // % of the map container — adjust (e.g. 20..35) to match embedded tower
          const w = `${towerPercent}%`;
          return (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '46%',
                width: w,
                height: w,
                transform: 'translate(-50%, -50%) scale(' + scale + ')',
                transformOrigin: 'center center',
                zIndex: 15, // above paths/perimeter, below team labels
                pointerEvents: 'none',
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/tower.png`}
                alt="Tower"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </div>
          );
        })()}
          {/* SVG paths */}
          <svg
            width={size}
            height={size}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                pointerEvents: 'none',
                zIndex: 12,
            }}
            >
            <defs>
                {/* For textPath or future use */}
            </defs>
              {names.map((team, i) => {
                if (!visiblePaths[i]) return null;
                const angle = (2 * Math.PI * i) / names.length - Math.PI / 2;
                const startX = center + mapRadius * Math.cos(angle);    // original start at border
                const startY = center + mapRadius * Math.sin(angle);

                // Tail: small line that starts just outside the perimeter so
                // it visually emerges from underneath the perimeter image.
                const tailLength = 12 * coordScale; // px — tweak to make tail longer/shorter, scaled
                const tailStartX = center + (mapRadius + tailLength) * Math.cos(angle);
                const tailStartY = center + (mapRadius + tailLength) * Math.sin(angle);

                const teamPaths = team.paths && team.paths.length > 0 ? team.paths : [{
                  members: team.members,
                  color: team.color,
                  curves: [{
                    controlX: (startX + center) / 2,
                    controlY: (startY + center) / 2 + (team.pathControl?.curve ?? -80),
                    endX: center,
                    endY: center
                  }]
                }];

                // collect all curves for branches renderer (fixes "allCurves is not defined")
                const allCurves = teamPaths.reduce((acc, p) => acc.concat(p.curves || []), []);

                // --- 1. Build visible segments, each segment keeps its own thickness ---
                let pathsToRender = [];
                // start chaining from the tail so we can prepend a short tail -> border segment
                let prevX = tailStartX;
                let prevY = tailStartY;
                let curveIdx = 0;
                teamPaths.forEach((path, pathIdx) => {
                  const curves = path.curves || [];
                  if (curves.length === 0) return;

                  // If this is the first logical path, prepend the tail by moving
                  // from tailStart -> border start (startX/startY), then begin curves
                  let segmentD;
                  let segPrevX;
                  let segPrevY;

                  if (pathIdx === 0) {
                    // start outside map (tail), draw straight line to exact border start,
                    // then append curves starting from startX/startY
                    segmentD = `M ${tailStartX} ${tailStartY} L ${startX} ${startY}`;
                    segPrevX = startX;
                    segPrevY = startY;
                  } else {
                    segmentD = `M ${prevX} ${prevY}`;
                    segPrevX = prevX;
                    segPrevY = prevY;
                  }

                  curves.forEach(curve => {
                    const endX = curve.endX === 'tower' ? center : curve.endX * coordScale;
                    const endY = curve.endY === 'tower' ? center : curve.endY * coordScale;
                    segmentD += ` Q ${curve.controlX * coordScale} ${curve.controlY * coordScale}, ${endX} ${endY}`;
                    segPrevX = endX;
                    segPrevY = endY;
                    curveIdx++;
                  });

                  prevX = segPrevX;
                  prevY = segPrevY;
                  const thickness = (Array.isArray(path.members) && path.members.length > 0 ? path.members.length * 4 : 4) * coordScale;
                  const color = path.color ?? team.color;
                  pathsToRender.push(
                    <path
                      key={team.label + '-visible-' + pathIdx}
                      d={segmentD}
                      stroke={color}
                      strokeWidth={thickness}
                      fill="none"
                      opacity={1}
                      style={{ pointerEvents: 'none' }}
                    />
                  );
                });

                // --- 2. Hoverable (transparent) paths — include same tail L -> startX for first segment ---
                prevX = tailStartX;
                prevY = tailStartY;
                let hoverPaths = teamPaths.map((path, idx) => {
                  const curves = path.curves || [];
                  if (curves.length === 0) return null;
                  const color = path.color ?? team.color;
                  const thickness = (Array.isArray(path.members) && path.members.length > 0
                    ? path.members.length * 4
                    : 4) * coordScale;

                  let d;
                  let segPrevX;
                  let segPrevY;
                  if (idx === 0) {
                    d = `M ${tailStartX} ${tailStartY} L ${startX} ${startY}`;
                    segPrevX = startX;
                    segPrevY = startY;
                  } else {
                    d = `M ${prevX} ${prevY}`;
                    segPrevX = prevX;
                    segPrevY = prevY;
                  }

                  curves.forEach(curve => {
                    const endX = curve.endX === 'tower' ? center : curve.endX * coordScale;
                    const endY = curve.endY === 'tower' ? center : curve.endY * coordScale;
                    d += ` Q ${curve.controlX * coordScale} ${curve.controlY * coordScale}, ${endX} ${endY}`;
                    segPrevX = endX;
                    segPrevY = endY;
                  });

                  prevX = segPrevX;
                  prevY = segPrevY;

                  let memberLabel = "";
                  if (Array.isArray(path.members) && path.members.length > 0) {
                    memberLabel = path.members.join(", ");
                  } else if (typeof path.member === "string") {
                    memberLabel = path.member;
                  } else {
                    memberLabel = team.label;
                  }

                  return (
                    <path
                      key={team.label + '-hover-' + idx}
                      d={d}
                      stroke="transparent"
                      strokeWidth={Math.max(thickness, 12 * coordScale)}
                      fill="none"
                      opacity={1}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      onMouseEnter={e => {
                        setHoveredPath({
                          teamIdx: i,
                          pathIdx: idx,
                          members: memberLabel,
                          color,
                        });
                      }}
                      onMouseMove={e => {
                        const svgRect = e.target.ownerSVGElement.getBoundingClientRect();
                        setMousePos({
                          x: (e.clientX - svgRect.left) / scale,
                          y: (e.clientY - svgRect.top) / scale,
                        });
                      }}
                      onMouseLeave={() => setHoveredPath(null)}
                    />
                  );
                });

                // --- 3. Branches (with hover/tooltip) ---
                return (
                  <React.Fragment key={team.label}>
                    {pathsToRender}
                    {hoverPaths}
                    {renderBranches({
                      curves: allCurves,
                      startX: startX,
                      startY: startY,
                      color: team.color,
                      thickness: 4
                    })}
                  </React.Fragment>
                );
            })}
            </svg>
            {/* Perimeter overlay: sits above the paths (so paths appear underneath)
                but below the team labels (labels use zIndex: 20). */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '100%',   // match the scaled overlays container (avoid double-scaling)
                height: '100%',  // match the scaled overlays container (avoid double-scaling)
                transform: 'translate(-50%, -50%)',
                zIndex: 14,            // > svg zIndex (12) so it covers paths, < names zIndex (20)
                pointerEvents: 'none', // allow pointer events to reach the hover paths/names
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/forest_of_death_perimeter.png`}
                alt="Forest perimeter"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </div>
            
            {names.map((team, i) => {
              const angle = (2 * Math.PI * i) / names.length - Math.PI / 2;
              const x = center + nameRadius * Math.cos(angle);
              const y = center + nameRadius * Math.sin(angle);
              return (
                <div
                  key={team.label}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 20,
                    pointerEvents: 'auto',
                  }}
                >
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontSize: isMobile ? '0.66rem' : '1.2rem',
                      fontWeight: 'bold',
                      whiteSpace: isMobile ? 'normal' : 'nowrap',
                      cursor: 'pointer',
                      marginBottom: '0.3rem',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      maxWidth: isMobile ? '2rem' : 'none',
                    }}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={isMobile ? () => handleToggle(i) : undefined}
                  >
                    {isMobile && team.label.includes(' / ') ? team.label.split(' / ')[0] : team.label}
                  </span>
                  {!isMobile && (
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginTop: '0.1rem',
                      cursor: 'pointer',
                      userSelect: 'none',
                      position: 'relative', 
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={visiblePaths[i]}
                      onChange={() => handleToggle(i)}
                      style={{
                        appearance: 'none',
                        width: isMobile ? '16px' : '22px',
                        height: isMobile ? '16px' : '22px',
                        borderRadius: '50%',
                        border: '2px solid #000',
                        display: 'inline-block',
                        margin: 0,
                        outline: 'none',
                        position: 'relative', 
                        verticalAlign: 'middle',
                        cursor: 'pointer', // <-- add this
                      }}
                    />
                    {/* Custom checkmark */}
                    {visiblePaths[i] && (
                      <svg
                        width={isMobile ? "16" : "22"}
                        height={isMobile ? "16" : "22"}
                        style={{
                          position: 'absolute',
                          pointerEvents: 'none',
                          left: 0,
                          top: 0,
                          // Fix alignment with transform:
                          transform: 'translate(2px, 2px)', 
                        }}
                      >
                        <circle
                          cx={isMobile ? "6" : "9"}
                          cy={isMobile ? "6" : "9"}
                          r={isMobile ? "5" : "8"}
                          fill="none"
                          strokeWidth="2"
                        />
                        <polyline
                          points={isMobile ? "3,6.5 5.5,9 10,4" : "5,10 8,13 14,6"}
                          fill="none"
                          stroke="#000"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </label>
                  )}
                </div>
              );
            })}
          {/* Tooltip for hovered path */}
          {hoveredPath && (
            <div
              style={{
                position: 'absolute',
                left: hoveredPath && mousePos.x ? mousePos.x : 0,
                top: hoveredPath && mousePos.y ? mousePos.y : 0,
                color: '#000',
                borderRadius: 8,
                padding: '0.4rem 0.8rem',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                pointerEvents: 'none',
                zIndex: 1000,
                whiteSpace: 'nowrap',
                transform: 'translate(-50%, -120%)',
              }}
            >
              {hoveredPath.members}
            </div>
          )}
          {/* Hovered info box */}
          {hoveredIdx !== null && (() => {
            const team = names[hoveredIdx];
            const angle = (2 * Math.PI * hoveredIdx) / names.length - Math.PI / 2;
            const x = center + nameRadius * Math.cos(angle);
            const y = center + nameRadius * Math.sin(angle);

            // If the team is below the equator, show the box above the name
            // The equator is y = center
            const offset = 48; // px
            const showAbove = y > center-1;
            const boxY = showAbove ? y - offset : y + offset;
            const boxTransform = showAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';

            return (
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: boxY,
                  transform: boxTransform,
                  width: 300,
                  minHeight: 300,
                  background: '#fff',
                  border: '2px solid #ccc',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 25,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  pointerEvents: 'none',
                  paddingBottom: '1rem',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={team.img}
                  alt={team.label}
                  style={{
                    width: '100%',
                    height: '70%',
                    objectFit: 'contain',
                    background: 'transparent',
                    marginBottom: '0.5rem',
                  }}
                />
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{team.label}</div>
                {team.members && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center' }}>
                    {team.members.map((member, idx) => (
                      <li
                        key={idx}
                        style={member === team.leader ? { fontStyle: 'italic' } : {}}
                      >
                        {member}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
}

export default ForestOfDeathPerimeterImage;