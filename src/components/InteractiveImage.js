import React, { useState } from 'react';
import '../App.css'; // Or a separate CSS file if you prefer

function InteractiveImage({ src, alt, info }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="interactive-image"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', borderRadius: '8px' }}
        />
      {hovered && (
        <div className="image-info">
          {info}
        </div>
      )}
    </div>
  );
}

export default InteractiveImage;