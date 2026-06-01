import React, { useEffect, useState } from 'react';
import './Compendium.css';
import './HandSeals.css';
import CompendiumLayout from './CompendiumLayout';
import HandSealViewer from './HandSealViewer';

const sealInfo = {
  horse: {
    subtitle: 'Creation / Tangibility',
    description: 'Commits chakra into existence, manifesting something tangible.',
  },
  bird: {
    subtitle: 'Nature / Domain Assignment',
    description: 'Assigns natural domain (i.e. fire, water, air, water, stone) to chakra.',
  },
  ram: {
    subtitle: 'Duplication / Multiplicity',
    description: 'Replicates a preexisting pattern.',
  },
  dog: {
    subtitle: 'Channel / Persistence',
    description: 'Adds duration to an effect.',
  },
  hare: {
    subtitle: 'Reduction / Cold / Negative Polarity (Yin)',
    description:
      'Biases a property to the negative end of its system. On its own, it signals reduction. Paired with bird, it signals cold or frost.',
  },
  ox: {
    subtitle: 'Amplification / Heat / Positive Polarity (Yang)',
    description:
      'Biases a property to the positive end of its system. On its own, it signals amplification. Paired with bird, it signals heat or fire.',
  },
  monkey: {
    subtitle: 'Stability / Wind / Oscillation',
    description:
      'Introduces symmetric variance to a property. On its own, it signals motion or oscillation. Paired with bird, it signals air or wind.',
  },
  rat: {
    subtitle: 'Instability / Current / Tension',
    description:
      'Introduces asymmetric variance to a property. On its own, it signals charge or current. Paired with bird, it signals electricity or lightning.',
  },
  boar: {
    subtitle: 'Hardness / Stone',
    description:
      'Introduces structural rigidity. On its own, it signals hardness or solidity. Paired with bird, it signals stone, metal, or earth.',
  },
  carp: {
    subtitle: 'Flexibility / Flow / Water',
    description:
      'Introduces structural plasticity. On its own, it signals malleability or fluidity. Paired with bird, it signals water or liquid.',
  },
  snake: {
    subtitle: 'Vitality / Anima / Autonomy',
    description:
      'Introduces vital coherence. On its own, it signifies vitality, spirituality or autonomy. Combined with ox, it signals life or healing. Combined with hare, it signals death or decay.',
  },
  deer: {
    subtitle: 'Space / Division / Branching',
    description:
      'Introduces spatial topology. On its own, it signals the division, branching, anchoring, or merging of space. Direction (branching vs merging) is resolved by accompanying polarity seals.',
  },
  dragon: {
    subtitle: 'Conceptualization / Dreaming',
    description:
      'Introduces conceptual form. On its own, it signals abstraction, imagination, or unreality, allowing a construct or effect to exist in concept rather than physically.',
  },
  bat: {
    subtitle: 'Sensory / Perception',
    description:
      'Introduces perceptual engagement, allowing effects to be sensed or perceived. On its own, it signals awareness or sensory input, governing how information is received rather than how it exists.',
  },
  fox: {
    subtitle: 'Shaping / Geometry',
    description:
      'Introduces explicit geometric definition. On its own, it signals intentional shaping; the final form is specified directly through hand and finger configuration rather than symbolic seals.',
  },
  tiger: {
    subtitle: 'Direction / Vector',
    description:
      'Introduces directional intent, defining the vector along which an effect resolves. On its own, it signals orientation or trajectory.',
  },
};

const seals = [
  'horse', 'bird', 'ram', 'dog',
  'hare', 'ox', 'monkey', 'rat',
  'boar', 'carp', 'snake', 'deer',
  'dragon', 'bat', 'fox', 'tiger',
];

function HandSeals() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <CompendiumLayout activeSlug="handseals">
      <article className="compendium compendium-wide">
        <h1 className="compendium-title-english">Hand Seals</h1>

        {isMobile ? (
          <HandSealViewer seals={seals} info={sealInfo} />
        ) : (
          <div className="hand-seals-grid">
            {seals.map((seal) => {
              const info = sealInfo[seal];
              const name = seal.charAt(0).toUpperCase() + seal.slice(1);
              return (
                <figure key={seal} className="hand-seal">
                  <img
                    src={`/images/hand_seals/${seal}.png`}
                    alt={`${seal} hand seal`}
                    className="hand-seal-image"
                  />
                  <figcaption className="hand-seal-caption">{name}</figcaption>
                  {info && (
                    <div className="hand-seal-tooltip" role="tooltip">
                      <div className="hand-seal-tooltip-title">{name}</div>
                      <div className="hand-seal-tooltip-subtitle">{info.subtitle}</div>
                      <p className="hand-seal-tooltip-description">{info.description}</p>
                    </div>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </article>
    </CompendiumLayout>
  );
}

export default HandSeals;
