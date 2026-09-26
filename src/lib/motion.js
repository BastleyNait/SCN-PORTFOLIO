/*
 * One entrance for the whole page: content slides in from a side and
 * settles, once, the first time it scrolls into view.
 *
 * - transform + opacity only, written as a full transform string so Motion
 *   keeps it on the compositor under load;
 * - a strong ease-out, never ease-in, so the part the reader is watching
 *   (the arrival) is the fast part;
 * - fires once: re-animating on every scroll-by is a page fighting its reader;
 * - reduced motion keeps a short fade and drops the travel entirely.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1];

const DISTANCE = 64;
const DURATION = 0.7;

/* Triggers a little after the element's top edge crosses into view, so the
   motion happens where the reader is looking rather than at the fold. */
const VIEWPORT = { once: true, margin: '0px 0px -80px 0px' };

/**
 * Motion props for a side entrance.
 * @param {'left'|'right'} from  side the element travels in from
 * @param {object} opts
 * @param {number} opts.delay    seconds; keep sibling steps within 30–80ms
 * @param {boolean} opts.reduce  the visitor's reduced-motion preference
 * @param {boolean} opts.onMount animate on mount instead of on scroll (above the fold)
 * @param {number} opts.distance travel in px
 */
export function slideIn(from = 'left', { delay = 0, reduce = false, onMount = false, distance = DISTANCE } = {}) {
  const offset = from === 'right' ? distance : -distance;
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, transform: `translateX(${offset}px)` };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, transform: 'translateX(0px)' };
  const transition = { duration: reduce ? 0.3 : DURATION, delay: reduce ? 0 : delay, ease: EASE_OUT };

  return onMount
    ? { initial: hidden, animate: shown, transition }
    : { initial: hidden, whileInView: shown, viewport: VIEWPORT, transition };
}

/** Delay for the nth sibling in a group, capped so long lists never make
 *  the reader wait for the last item. */
export const stagger = (index, step = 0.06, max = 4) => Math.min(index, max) * step;
