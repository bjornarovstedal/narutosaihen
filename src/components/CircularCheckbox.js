import React from 'react';

/**
 * Circular checkbox with custom checkmark
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {function} onChange - Handler for checkbox changes
 * @param {number} size - Size in pixels (default 22)
 * @param {boolean} isMobile - Whether to use mobile sizing
 */
function CircularCheckbox({ checked, onChange, size = 22, isMobile = false }) {
  const actualSize = isMobile ? 16 : size;
  
  // Define exact checkmark points for each size
  const getCheckmarkPoints = () => {
    if (actualSize === 28) return "7,13 11,17 19,8";
    if (isMobile) return "3,6.5 5.5,9 10,4";
    return "5,10 8,13 14,6";
  };
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
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
          margin: 0,
          outline: 'none',
          position: 'relative',
          cursor: 'pointer',
        }}
      />
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
          <polyline
            points={getCheckmarkPoints()}
            fill="none"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

export default CircularCheckbox;
