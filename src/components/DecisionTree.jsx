import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
 * The hero's one drawn moment: the decision log, grown as a tree.
 *
 * The portrait is the root, because every branch is a call one person made.
 * Each architecture decision record is a branch that ends in a brass node;
 * the options that were weighed and not taken leave as short dashed twigs
 * that stop dead. Hovering or focusing a node lights its branch and names
 * the decision; following it opens that record further down the page.
 *
 * Geometry is computed from the data, so an eighth record grows an eighth
 * branch without anyone touching this file.
 */

const W = 560;
const H = 560;
const ROOT = { x: W / 2, y: 500 };
const TRUNK_TOP = { x: W / 2, y: 392 };
const EASE = [0.16, 1, 0.3, 1];

function layout(records) {
  const n = records.length;
  const start = -160;
  const end = -20;
  const step = n > 1 ? (end - start) / (n - 1) : 0;

  return records.map((record, i) => {
    const deg = start + step * i;
    const rad = (deg * Math.PI) / 180;
    /* Alternate the reach so labels on neighbouring branches do not collide. */
    const reach = i % 2 === 0 ? 268 : 222;
    const node = {
      x: ROOT.x + Math.cos(rad) * reach * 0.98,
      y: ROOT.y + Math.sin(rad) * reach * 1.55
    };
    /* Branches leave the trunk at staggered heights, like a real one. */
    const fork = { x: TRUNK_TOP.x, y: TRUNK_TOP.y + 30 - (i % 3) * 22 };
    const c1 = { x: fork.x + (node.x - fork.x) * 0.08, y: fork.y - 90 };
    const c2 = { x: node.x - (node.x - fork.x) * 0.3, y: node.y + 80 };
    const path = `M ${fork.x} ${fork.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${node.x} ${node.y}`;

    /* Rejected options: twigs that leave the branch at 55% and stop. */
    const rejected = Math.min(Math.max((record.options?.length ?? 1) - 1, 0), 3);
    const mid = bezierPoint(fork, c1, c2, node, 0.55);
    const twigs = Array.from({ length: rejected }, (_, k) => {
      const spread = (k - (rejected - 1) / 2) * 34;
      const away = deg < -90 ? -1 : 1;
      const end = {
        x: mid.x + away * (26 + k * 8) + spread * 0.3,
        y: mid.y - 30 - Math.abs(spread) * 0.4 + k * 10
      };
      return { d: `M ${mid.x} ${mid.y} Q ${(mid.x + end.x) / 2} ${mid.y - 18}, ${end.x} ${end.y}`, end };
    });

    const labelSide = node.x < W / 2 ? 'end' : 'start';
    return { record, node, path, twigs, labelSide };
  });
}

function bezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y
  };
}

export default function DecisionTree({ records, portrait, portraitAlt, hint }) {
  const reduceMotion = useReducedMotion();
  const branches = useMemo(() => layout(records), [records]);
  const [active, setActive] = useState(null);

  const draw = (delay, duration = 0.9) => (
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { delay, duration, ease: EASE }, opacity: { delay, duration: 0.2 } }
        }
  );

  const activeBranch = branches.find((b) => b.record.id === active);

  return (
    <figure className="relative w-full max-w-[560px] mx-auto select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="group"
        aria-label={hint}
      >
        <defs>
          <radialGradient id="tree-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <clipPath id="tree-portrait">
            <circle cx={ROOT.x} cy={ROOT.y} r="44" />
          </clipPath>
        </defs>

        {/* Trunk */}
        <motion.path
          d={`M ${ROOT.x} ${ROOT.y - 44} L ${TRUNK_TOP.x} ${TRUNK_TOP.y}`}
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          {...draw(0.1, 0.5)}
        />

        {branches.map(({ record, path, twigs, node }, i) => {
          const isActive = active === record.id;
          const dimmed = active && !isActive;
          const delay = 0.45 + i * 0.09;
          return (
            <g
              key={record.id}
              style={{ opacity: dimmed ? 0.28 : 1, transition: 'opacity 0.35s var(--ease-out)' }}
            >
              {twigs.map((twig, k) => (
                <g key={k}>
                  <motion.path
                    d={twig.d}
                    stroke="var(--on-bottle-soft)"
                    strokeWidth="1.25"
                    strokeDasharray="3 4"
                    fill="none"
                    {...(reduceMotion ? {} : {
                      initial: { opacity: 0 },
                      animate: { opacity: 0.7 },
                      transition: { delay: delay + 0.55 + k * 0.08, duration: 0.5 }
                    })}
                  />
                  <motion.circle
                    cx={twig.end.x}
                    cy={twig.end.y}
                    r="3"
                    fill="var(--bottle)"
                    stroke="var(--on-bottle-soft)"
                    strokeWidth="1.25"
                    {...(reduceMotion ? {} : {
                      initial: { opacity: 0, scale: 0 },
                      animate: { opacity: 0.8, scale: 1 },
                      transition: { delay: delay + 0.7 + k * 0.08, duration: 0.4, ease: EASE }
                    })}
                  />
                </g>
              ))}

              <motion.path
                d={path}
                stroke="var(--accent)"
                strokeWidth={isActive ? 3 : 2}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-width 0.3s var(--ease-out)' }}
                {...draw(delay)}
              />

              {isActive && (
                <circle cx={node.x} cy={node.y} r="26" fill="url(#tree-glow)" />
              )}

              <motion.a
                href={`#${record.id}`}
                aria-label={`${record.id.toUpperCase()}: ${record.title}`}
                onMouseEnter={() => setActive(record.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(record.id)}
                onBlur={() => setActive(null)}
                className="cursor-pointer outline-none"
                style={{ transformOrigin: `${node.x}px ${node.y}px`, transformBox: 'view-box' }}
                {...(reduceMotion ? {} : {
                  initial: { scale: 0, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  transition: { delay: delay + 0.75, type: 'spring', stiffness: 420, damping: 22 }
                })}
              >
                {/* Generous invisible hit area around a small visible node. */}
                <circle cx={node.x} cy={node.y} r="20" fill="transparent" />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isActive ? 9 : 7}
                  fill="var(--accent)"
                  stroke="var(--bottle)"
                  strokeWidth="3"
                  style={{ transition: 'r 0.3s var(--ease-out)' }}
                />
                <text
                  x={node.x}
                  y={node.y - 16}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="11"
                  fontWeight="500"
                  fill={isActive ? 'var(--accent)' : 'var(--on-bottle-soft)'}
                  style={{ transition: 'fill 0.3s' }}
                >
                  {record.id.replace('adr-', '')}
                </text>
              </motion.a>
            </g>
          );
        })}

        {/* Root: the person who made the calls. */}
        <motion.g
          {...(reduceMotion ? {} : {
            initial: { opacity: 0, scale: 0.85 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.6, ease: EASE }
          })}
          style={{ transformOrigin: `${ROOT.x}px ${ROOT.y}px`, transformBox: 'view-box' }}
        >
          <circle cx={ROOT.x} cy={ROOT.y} r="52" fill="none" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1" />
          <circle cx={ROOT.x} cy={ROOT.y} r="46" fill="var(--bottle-deep)" stroke="var(--accent)" strokeWidth="2.5" />
          {portrait && (
            <image
              href={portrait}
              x={ROOT.x - 44}
              y={ROOT.y - 44}
              width="88"
              height="88"
              clipPath="url(#tree-portrait)"
              preserveAspectRatio="xMidYMid slice"
              aria-label={portraitAlt}
            />
          )}
        </motion.g>
      </svg>

      {/* Caption: names the decision under the pointer, or says how to read
          the tree when nothing is picked. Announced politely. */}
      <figcaption
        className="mt-2 min-h-[3.5rem] text-center px-4"
        aria-live="polite"
      >
        {activeBranch ? (
          <span className="block">
            <span className="block font-mono text-[11px] text-[var(--accent)] mb-0.5">
              {activeBranch.record.id.toUpperCase()} · {activeBranch.record.project}
            </span>
            <span className="block font-heading font-semibold text-base sm:text-lg text-[var(--on-bottle)] leading-snug text-balance">
              {activeBranch.record.title}
            </span>
          </span>
        ) : (
          <span className="text-sm text-[var(--on-bottle-soft)]">{hint}</span>
        )}
      </figcaption>
    </figure>
  );
}
