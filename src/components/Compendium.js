import React from 'react';
import './Compendium.css';
import CompendiumLayout from './CompendiumLayout';

function Compendium() {
  return (
    <CompendiumLayout>
      <article className="compendium">
        <h1 className="compendium-title-english">Compendium</h1>
        <h2 className="compendium-title-romanized">Hyakka Jiten</h2>
        <h3 className="compendium-title-kanji">百科事典</h3>
      </article>
    </CompendiumLayout>
  );
}

export default Compendium;