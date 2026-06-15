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
  ram: {
    subtitle: 'Duplication / Multiplicity',
    description: 'Replicates a preexisting pattern.',
  },
  dog: {
    subtitle: 'Channel / Persistence',
    description: 'Adds duration to an effect.',
  },
  bird: {
    subtitle: 'Nature / Domain Assignment',
    description: 'Assigns natural domain (i.e. fire, water, air, water, stone) to chakra.',
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
  'horse', 'ram', 'dog', 'bird', 
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

        <section className="hand-seals-copy compendium-content">
          <p className="hand-seals-intro-line">
            <strong>Naruto: Saihen</strong> introduces a rigid system for hand seals.
          </p>
        </section>

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

        <section className="hand-seals-copy hand-seals-followup compendium-content">
          <h2 className="hand-seals-section-title">Syntax.</h2>
          <p>
            A seal sequence has an immutable grammatical structure. It starts by declaring where the effect comes from, describes what the effect is, and closes by resolving how it manifests. Each seal in the sentence has a distinct grammatical role.
          </p>
          <ol className="hand-seals-syntax-list">
            <li>
              <strong>1: Origin.</strong> The first seal commits the jutsu to substance.
              <p>
                Horse creates something from nothing. It is the most taxing option, as
                everything for the effect must be provided from the caster&apos;s own chakra.
              </p>
              <p>
                Dragon commits the effect to concept rather than matter. It has near zero
                chakra toll on its own, but the cost is often complexity of technique.
              </p>
              <p>Omitting origin by manipulating existing material is the least taxing approach.</p>
            </li>
            <li>
              <strong>1.1: Qualifiers.</strong> A qualifier seal after the origin modifies the
              act of commitment. Ram duplicates an existing referent. Dog sustains the effect
              beyond its natural duration.
            </li>
            <li>
              <strong>2: Nature assignment.</strong> Bird does nothing on its own. Its function
              is to change the meaning of the seals that follow it from their base readings to
              their elemental ones.
            </li>
            <li>
              <strong>3: Property seals.</strong> The property seals act as the descriptors of
              the effect. After bird, they are read elementally; carp becomes water, ox becomes
              fire, rat becomes lightning, and so on. Without bird, they retain their base
              meaning.
            </li>
            <li>
              <strong>4: Topology, vector, and shape.</strong> The sequence closes with spatial
              resolution. Fox controls form, deer controls topology, and tiger controls
              direction. The first is unique in that the caster often ends the sequence by
              forming the shape with their fingers or hand. Deer and tiger are similarly unique
              in having one-handed shorthands, allowing a caster to adjust the topology or
              direction of a jutsu mid-execution without signing them anew.
            </li>
          </ol>
          <p>
            With more complex jutsu, the sentence grows: more qualifiers, more properties, longer chains, but the underlying grammar remains.
          </p>
        </section>

        <section className="hand-seals-copy compendium-content">
          <h2 className="hand-seals-section-title">Half the equation.</h2>
          <p>
            In addition to signing the seals fluidly, the shinobi also has to knead their
            chakra accordingly. Therefore, it is difficult (but not impossible) to read the
            exact jutsu being signed without knowing it prior. There are two exceptions to
            this: the two dōjutsu <em>sharingan</em>, with its supreme insight, and <em>byakugan</em>, able to
            perceive chakra.
          </p>
        </section>

        <section className="hand-seals-copy compendium-content">
          <h2 className="hand-seals-section-title">Examples</h2>
          <h3 className="hand-seals-subsection-title">Elemental releases:</h3>
          <ul className="hand-seals-examples-list">
            <li><strong>Wind:</strong> Horse (Creation) + Bird (Nature) + Monkey (Motion)</li>
            <li><strong>Earth:</strong> Horse (Creation) + Bird (Nature) + Boar (Solid)</li>
            <li><strong>Lava:</strong> Horse (Creation) + Bird (Nature) + Boar (Stone) + Ox (Heat)</li>
            <li><strong>Water:</strong> Horse (Creation) + Bird (Nature) + Carp (Liquid)</li>
            <li><strong>Ice:</strong> Horse (Creation) + Bird (Nature) + Carp (Liquid) + Hare (Cold)</li>
            <li><strong>Lightning:</strong> Horse (Creation) + Bird (Nature) + Rat (Charge)</li>
            <li><strong>Fire:</strong> Horse (Creation) + Bird (Nature) + Ox (Heat)</li>
          </ul>
          <h3 className="hand-seals-subsection-title">Ninjutsu examples:</h3>
          <ul className="hand-seals-examples-list">
            <li>
              <strong>Fireball release:</strong> Horse (Creation) + Bird (Nature) + Ox (Heat) + Fox (Shaping) →
              circle.
            </li>
            <li><strong>Chidori:</strong> Horse (Creation) + Dog (Channel) + Bird (Nature) + Rat (Charge)</li>
            <li>
              <strong>Kage bunshin no Jutsu:</strong> Horse (Creation) + Ram (Duplication) + Snake (Vitality) +
              Dog (Channel)
            </li>
            <li>
              <strong>Henge no Jutsu:</strong> Dragon (Concept) + Snake (Vitality) + Dog (Channel)
            </li>
            <li>
              <strong>Suirō no Jutsu</strong> (water prison technique, w/o existing water): Horse (Creation) +
              Bird (Nature) + Carp (Liquid) + Dog (Channel) + Tiger (Direction control)
            </li>
            <li>
              <strong>Suirō no Jutsu</strong> (water prison technique, w/ existing water): Bird (Nature) +
              Carp (Liquid) + Tiger (Direction control) + Dog (Channel) + Tiger (Direction
              control)
              <p className="hand-seals-note">
                Note the double tiger; the first is to move the existing water into the desired
                position, the latter is to designate the swirl of the water once the prison is
                established.
              </p>
            </li>
            <li>
              <strong>Kagemane no Jutsu</strong> (shadow imitation technique): Hare (Reduction) + Tiger
              (Direction control) + Dog (Channel) + Ram (Duplication)
              <p className="hand-seals-note">
                Note that hare has an esoteric meaning in this technique; the absence of light.
              </p>
            </li>
            <li>
              <strong>Water Release: Water Dragon Bullet Technique:</strong> Bird (Nature) + Carp (Liquid) + Ox
              (Amplification) + Snake (Vitality) + Dog (Channel) + Fox (Shaping) → coiling arms
              + Tiger (Direction control)
              <p className="hand-seals-note">
                This is an involved technique, although, as we can see, the system doesn&apos;t
                support forty-four seals. The complexity arises from… well, complexity. Zabuza and
                Kakashi need to shape it like a dragon, make it seem alive, and toss it, all while
                doing the same thing you would do while throwing water normally. And if they&apos;re
                not in a lake, neither of these two can probably use this technique, as they&apos;re
                not fountains of chakra. At least not in Saihen. And it might very well be that Kakashi needs two ox seals, while Zabuzu needs only one, to accrue sufficient enough water, or Zaubuza needs two carps to knead the water while Kakashi needs one. The seal in combination with the personal nature of chakra makes it less of an exact science; this is more true the more complex the technique.
              </p>
            </li>
          </ul>
        </section>
      </article>
    </CompendiumLayout>
  );
}

export default HandSeals;
