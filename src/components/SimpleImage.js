import React from 'react';

function SimpleImage({ src, alt }) {
  return (
    <div style={{ margin: '2rem auto 6rem', maxWidth: '100%' }}>
      <img
        src={src}
        alt={alt}
        style={{ display: 'block', maxWidth: '100%', height: 'auto', margin: '0 auto' }}
      />
    </div>
  );
}

export default SimpleImage;