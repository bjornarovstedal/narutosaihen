import { useState } from 'react';
import './ChapterContext.css';

function parseContextText(text) {
  const parts = text.split(/(<b>.*?<\/b>|<i>.*?<\/i>|<a href='.*?'>.*?<\/a>)/g);
  return parts.map((part, index) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <b key={index}>{part.slice(3, -4)}</b>;
    }
    if (part.startsWith('<i>') && part.endsWith('</i>')) {
      return <i key={index}>{part.slice(3, -4)}</i>;
    }
    if (part.startsWith("<a href='") && part.endsWith('</a>')) {
      const hrefMatch = part.match(/<a href='(.*?)'>(.*?)<\/a>/);
      if (hrefMatch) {
        return <a key={index} href={hrefMatch[1]}>{hrefMatch[2]}</a>;
      }
    }
    return part;
  });
}

function ChapterContext({ context }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!context) {
    return null;
  }

  const { title = 'Context', content = '' } = typeof context === 'string'
    ? { content: context }
    : context;

  const lines = content.split(/\r?\n/);

  return (
    <aside className="chapter-context" role="note">
      <button
        type="button"
        className="chapter-context-toggle"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <span className={`chevron chapter-context-chevron ${isExpanded ? 'chevron-down' : ''}`}>›</span>
        <span className="chapter-context-label">{title}</span>
      </button>
      {isExpanded && (
        <div className="chapter-context-body">
          {lines.map((line, idx) =>
            line.trim() === '' ? (
              <div key={idx} className="chapter-context-blank-line"></div>
            ) : (
              <p key={idx} className="chapter-context-line">{parseContextText(line)}</p>
            )
          )}
        </div>
      )}
    </aside>
  );
}

export default ChapterContext;
