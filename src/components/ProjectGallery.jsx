import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, ImageOff, Pause, Play } from 'lucide-react';
import { useAppContext } from '../context/app-context';
import imageManifest from '../data/imageManifest.json';

/* Widths emitted by scripts/optimize-images.mjs. Keep the two in step.
   The descriptors name the 16:9 box a variant was cut for, not its pixel
   width, so a portrait phone capture is picked by the same rule as a desktop
   one. Every slide is drawn with object-contain inside a fixed box, so the
   browser only ever needs the aspect ratio, which the descriptor preserves. */
const WIDTHS = [640, 1280];
const STAGE_SIZES = '(max-width: 1023px) calc(100vw - 2rem), 680px';
const LIGHTBOX_SIZES = '(max-width: 1320px) 100vw, 1280px';
const THUMB_SIZES = '120px';

/* A horizontal drag past this many pixels, or a fast flick, turns the slide. */
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

const NO_SLIDES = [];

/* How long each slide stays up while the gallery plays on its own. Long
   enough to read a screenshot, short enough that a visitor scrolling past
   still sees two or three of them. */
const SLIDE_MS = 4500;

/* The stage takes the shape of the gallery's own desktop screenshots, so a set
   of 2:1 browser captures fills it edge to edge instead of floating in a 16:9
   box with a band of dead space. Clamped so one odd capture cannot turn the
   stage into a letterbox slot or a square. Phone captures are left out of the
   vote: they are always drawn contained, centred in whatever the stage is. */
const STAGE_RATIO_MIN = 9 / 21;
const STAGE_RATIO_MAX = 10 / 16;

function stageRatio(slides) {
  const landscape = slides.filter((s) => s.width >= s.height).map((s) => s.height / s.width);
  if (landscape.length === 0) return 9 / 16;
  const sorted = [...landscape].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return Math.min(STAGE_RATIO_MAX, Math.max(STAGE_RATIO_MIN, median));
}

const slideSrc = (id, slide, width) => `/projects/${id}/${slide.file}-${width}.webp`;
const slideSrcSet = (id, slide) => WIDTHS.map((w) => `${slideSrc(id, slide, w)} ${w}w`).join(', ');

/** What the fake browser chrome shows: the live domain, or whatever the
 *  project data says stands in for it when there is no public URL. */
function chromeLabel(project) {
  if (project.liveUrl) return project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return project.previewLabel || `${project.id}.apk`;
}

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');

/* Everything a gallery needs to move: the current slide, manual stepping and
   the autoplay loop with all the reasons it should hold still. Shared by the
   framed gallery and the full-bleed showcase so the two behave identically. */
function useSlideshow({ slides, projectId, sizes }) {
  const reduceMotion = useReducedMotion();
  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  /* Autoplay. The visitor's own switch, plus every reason to hold still:
     off screen, tab hidden, pointer resting on the image, keyboard focus
     inside, or the lightbox open. Reduced-motion users start paused and
     can still press play. */
  const [playing, setPlaying] = useState(!reduceMotion);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const frameRef = useRef(null);
  const elapsed = useRef(0);
  const shownIndex = useRef(0);

  const multiple = total > 1;
  const running = multiple && playing && inView && pageVisible && !hovering && !focusWithin && !lightboxOpen;

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sync = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const go = useCallback((step) => {
    if (total < 2) return;
    setDirection(step);
    setIndex((current) => (current + step + total) % total);
  }, [total]);

  const jump = (next) => {
    setDirection(next >= index ? 1 : -1);
    setIndex(next);
  };

  /* One timeout per slide. Pausing banks the time already spent, so resuming
     finishes the current slide instead of starting it over; a new slide,
     whether it came from the timer or from the visitor, starts from zero. */
  useEffect(() => {
    if (shownIndex.current !== index) {
      shownIndex.current = index;
      elapsed.current = 0;
    }
    if (!running) return;
    const startedAt = performance.now();
    const timer = setTimeout(() => go(1), Math.max(0, SLIDE_MS - elapsed.current));
    return () => {
      clearTimeout(timer);
      elapsed.current += performance.now() - startedAt;
    };
  }, [running, index, go]);

  /* Only the next slide is fetched, and only once the gallery is on screen,
     so seven galleries below the fold cost one image each, not all of them. */
  useEffect(() => {
    if (!inView || total < 2) return;
    const img = new Image();
    img.sizes = sizes;
    img.srcset = slideSrcSet(projectId, slides[(index + 1) % total]);
  }, [inView, index, total, slides, projectId, sizes]);

  return {
    index, direction, go, jump, multiple, running, playing,
    togglePlaying: () => setPlaying((value) => !value),
    frameRef, lightboxOpen, setLightboxOpen, reduceMotion,
    containerProps: {
      onFocus: () => setFocusWithin(true),
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
      }
    },
    hoverProps: {
      /* Mouse only: a tap on a phone fires pointerenter and never the
         matching leave, which would park the gallery for good. */
      onPointerEnter: (event) => { if (event.pointerType === 'mouse') setHovering(true); },
      onPointerLeave: (event) => { if (event.pointerType === 'mouse') setHovering(false); }
    }
  };
}

export default function ProjectGallery({ project, priority = false }) {
  const { t } = useAppContext();
  const slides = imageManifest[project.id] ?? NO_SLIDES;
  const total = slides.length;
  const ratio = stageRatio(slides);

  const {
    index, direction, go, jump, multiple, running, playing, togglePlaying,
    frameRef, lightboxOpen, setLightboxOpen, reduceMotion, containerProps, hoverProps
  } = useSlideshow({ slides, projectId: project.id, sizes: STAGE_SIZES });
  const dragged = useRef(false);
  const stripRef = useRef(null);

  /* With more thumbnails than fit, keep the current one centred in the
     strip. Scrolls the strip sideways only, never the page. */
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.querySelector(`[data-thumb="${index}"]`);
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [index, reduceMotion]);

  if (total === 0) {
    return (
      <Frame ref={frameRef} project={project} counter={null}>
        <div className="relative aspect-video flex flex-col items-center justify-center gap-2 bg-stripes text-[var(--muted-color)]">
          <ImageOff className="w-8 h-8" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wider">{project.title}</span>
        </div>
      </Frame>
    );
  }

  const slide = slides[index];
  const counter = multiple
    ? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    : null;
  const altFor = (s, i) =>
    s.caption
      ? `${project.title}: ${s.caption}`
      : fill(t.projects.slideAlt, { title: project.title, n: i + 1, total });

  /* The incoming slide drifts in over the outgoing one while both fade, so
     the loop reads as one continuous reel rather than a hard cut. */
  const offset = reduceMotion ? 0 : 32;
  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir * offset, scale: reduceMotion ? 1 : 1.02 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0 }
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
  };

  return (
    <>
      <Frame
        ref={frameRef}
        project={project}
        counter={counter}
        onExpand={() => setLightboxOpen(true)}
        expandLabel={t.projects.openGallery}
        playback={multiple ? {
          playing,
          toggle: togglePlaying,
          label: playing ? t.projects.pauseSlideshow : t.projects.playSlideshow
        } : null}
      >
        <div
          role="region"
          aria-roledescription={t.projects.carouselRole}
          aria-label={fill(t.projects.galleryLabel, { title: project.title })}
          onKeyDown={multiple ? onKeyDown : undefined}
          {...containerProps}
          className="relative"
        >
          <div
            className="relative overflow-hidden bg-stripes bg-[var(--bg-color)]"
            style={{ aspectRatio: `${1 / ratio}` }}
            {...hoverProps}
          >
            {multiple && (
              <div className="absolute top-2 inset-x-2 z-20 flex gap-1 pointer-events-none" aria-hidden="true">
                {slides.map((s, i) => (
                  <span key={s.file} className="relative h-1 flex-1 bg-white/40 shadow-[0_0_0_1px_rgba(0,0,0,0.25)] overflow-hidden">
                    {i < index && <span className="absolute inset-0 bg-[var(--accent)]" />}
                    {i === index && (
                      <span
                        key={index}
                        className="gallery-progress absolute inset-0 bg-[var(--accent)] origin-left"
                        style={{
                          animationDuration: `${SLIDE_MS}ms`,
                          animationPlayState: running ? 'running' : 'paused'
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>
            )}

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.button
                key={slide.file}
                type="button"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag={multiple && !reduceMotion ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragStart={() => { dragged.current = true; }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1);
                  else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1);
                  /* The click that ends a drag must not also open the lightbox. */
                  requestAnimationFrame(() => { dragged.current = false; });
                }}
                onClick={() => { if (!dragged.current) setLightboxOpen(true); }}
                aria-label={`${t.projects.openGallery}: ${altFor(slide, index)}`}
                className="absolute inset-0 w-full h-full cursor-zoom-in touch-pan-y"
              >
                <img
                  src={slideSrc(project.id, slide, WIDTHS.at(-1))}
                  srcSet={slideSrcSet(project.id, slide)}
                  sizes={STAGE_SIZES}
                  width={slide.width}
                  height={slide.height}
                  alt=""
                  loading={priority && index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-contain object-center select-none pointer-events-none"
                />
              </motion.button>
            </AnimatePresence>

            {slide.caption && (
              <span className="absolute bottom-3 left-3 z-10 neo-tag bg-[var(--card-color)] text-[10px] uppercase tracking-wider pointer-events-none">
                {slide.caption}
              </span>
            )}

            <span className="absolute bottom-3 right-3 z-10 neo-tag bg-[var(--ink)] text-[var(--bg-color)] text-[10px] font-bold uppercase tracking-wider pointer-events-none">
              {project.status}
            </span>

          </div>

          {/* Announced when the visitor moves the gallery, silent while it
              plays on its own so a screen reader is not interrupted every
              few seconds. */}
          <p className="sr-only" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
            {multiple ? fill(t.projects.slideStatus, { n: index + 1, total }) : ''}
          </p>

          {/* Control rail under the image: previous and next sit at its ends,
              the thumbnails between them, so nothing covers the screenshot. */}
          {multiple && (
            <div className="flex items-stretch gap-2 p-2 border-t-[3px] border-[var(--ink)] bg-[var(--bg-color)]">
            <RailArrow side="left" label={t.projects.prevSlide} onClick={() => go(-1)} />
            <ul ref={stripRef} className="flex-1 min-w-0 flex gap-2 overflow-x-auto list-none m-0 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <li key={s.file} data-thumb={i} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => jump(i)}
                      aria-label={altFor(s, i)}
                      aria-current={active ? 'true' : undefined}
                      className={`block w-20 sm:w-24 aspect-video overflow-hidden border-2 bg-stripes cursor-pointer transition-[opacity,box-shadow,transform] duration-150 ${
                        active
                          ? 'border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] -translate-x-px -translate-y-px opacity-100 outline outline-2 outline-offset-1 outline-[var(--accent)]'
                          : 'border-[var(--ink)]/40 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={slideSrc(project.id, s, WIDTHS[0])}
                        sizes={THUMB_SIZES}
                        width={s.width}
                        height={s.height}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
            <RailArrow side="right" label={t.projects.nextSlide} onClick={() => go(1)} />
            </div>
          )}
        </div>
      </Frame>

      <Lightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        project={project}
        slide={slide}
        alt={altFor(slide, index)}
        counter={counter}
        onPrev={multiple ? () => go(-1) : null}
        onNext={multiple ? () => go(1) : null}
      />
    </>
  );
}

/* The browser-window frame every gallery sits in. The chrome bar carries the
   domain, the slide counter and the full-screen control. */
const Frame = React.forwardRef(function Frame({ project, counter, onExpand, expandLabel, playback, children }, ref) {
  return (
    <div ref={ref} className="neo-frame overflow-hidden">
      <div className="h-9 bg-[var(--bg-color)] border-b-[3px] border-[var(--ink)] px-3 flex items-center gap-3">
        <span className="flex gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--ink)] bg-[var(--accent)]" />
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--ink)]" />
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--ink)]" />
        </span>

        <span className="font-mono text-[10px] text-[var(--ink)] font-semibold truncate bg-[var(--card-color)] px-2 py-0.5 border border-[var(--ink)] min-w-0">
          {chromeLabel(project)}
        </span>

        <span className="ml-auto flex items-center gap-2 shrink-0">
          {counter && (
            <span className="font-mono text-[10px] font-bold tabular-nums text-[var(--muted-color)]" aria-hidden="true">
              {counter}
            </span>
          )}
          {playback && (
            <button
              type="button"
              onClick={playback.toggle}
              aria-label={playback.label}
              aria-pressed={!playback.playing}
              title={playback.label}
              className="w-6 h-6 inline-flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--card-color)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] cursor-pointer transition-colors"
            >
              {playback.playing
                ? <Pause className="w-3 h-3" aria-hidden="true" />
                : <Play className="w-3 h-3" aria-hidden="true" />}
            </button>
          )}
          {onExpand && (
            <button
              type="button"
              onClick={onExpand}
              aria-label={expandLabel}
              title={expandLabel}
              className="w-6 h-6 inline-flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--card-color)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] cursor-pointer transition-colors"
            >
              <Maximize2 className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
        </span>
      </div>
      {children}
    </div>
  );
});

/* Previous / next in the site's own button language: ink frame, hard
   shadow, accent on hover, pressed flat into the shadow on click. The
   chevron nudges toward where it will take you. */
function RailArrow({ side, label, onClick, compact = false }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`group/arrow shrink-0 flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--card-color)] text-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] cursor-pointer transition-[transform,box-shadow,background-color,color] duration-150 ease-out hover:bg-[var(--accent)] hover:text-[var(--on-accent)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0px_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
        compact ? 'w-8 h-8' : 'w-11 sm:w-12'
      }`}
    >
      <Icon
        className={`w-5 h-5 transition-transform duration-150 ease-out ${
          side === 'left' ? 'group-hover/arrow:-translate-x-0.5' : 'group-hover/arrow:translate-x-0.5'
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

function StageArrow({ side, label, onClick, inline = false }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  const place = inline ? '' : `absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-3' : 'right-3'} z-20`;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${place} w-10 h-10 inline-flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--card-color)] text-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] cursor-pointer transition-[transform,box-shadow,background-color] duration-100 hover:bg-[var(--accent)] hover:text-[var(--on-accent)] hover:shadow-[3px_3px_0px_var(--ink)] active:shadow-none active:translate-x-0.5`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

/* A native <dialog>: focus trapping, Escape and the inert page behind it come
   from the browser instead of from code that has to be kept correct. */
function Lightbox({ open, onClose, project, slide, alt, counter, onPrev, onNext }) {
  const { t } = useAppContext();
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' && onNext) { event.preventDefault(); onNext(); }
    if (event.key === 'ArrowLeft' && onPrev) { event.preventDefault(); onPrev(); }
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onKeyDown={onKeyDown}
      /* A click that lands on the backdrop targets the dialog element itself. */
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      aria-label={fill(t.projects.galleryLabel, { title: project.title })}
      className="lightbox m-auto p-0 bg-transparent max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-visible"
    >
      {open && (
        <div className="neo-frame overflow-hidden">
          <div className="h-11 bg-[var(--bg-color)] border-b-[3px] border-[var(--ink)] px-3 flex items-center gap-3">
            <span className="font-heading font-black text-sm text-[var(--ink)] truncate">{project.title}</span>
            {slide.caption && (
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-wider text-[var(--muted-color)] truncate">
                {slide.caption}
              </span>
            )}
            <span className="ml-auto flex items-center gap-3 shrink-0">
              {/* In the lightbox the image gets the whole stage too: previous
                  and next sit in the header, either side of the counter. */}
              {onPrev && <RailArrow compact side="left" label={t.projects.prevSlide} onClick={onPrev} />}
              {counter && (
                <span className="font-mono text-xs font-bold tabular-nums text-[var(--muted-color)]">{counter}</span>
              )}
              {onNext && <RailArrow compact side="right" label={t.projects.nextSlide} onClick={onNext} />}
              <button
                type="button"
                onClick={onClose}
                aria-label={t.projects.closeGallery}
                autoFocus
                className="w-8 h-8 inline-flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--card-color)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </span>
          </div>

          {/* Sized by the image itself, capped by the viewport, so a slide is
              shown as large as the screen allows at its own proportions. */}
          <div className="relative bg-stripes bg-[var(--bg-color)] flex items-center justify-center min-w-[min(320px,calc(100vw-2rem))]">
            <img
              key={slide.file}
              src={slideSrc(project.id, slide, WIDTHS.at(-1))}
              srcSet={slideSrcSet(project.id, slide)}
              sizes={LIGHTBOX_SIZES}
              width={slide.width}
              height={slide.height}
              alt={alt}
              decoding="async"
              className="block w-auto h-auto max-w-[min(1280px,calc(100vw-2rem-6px))] max-h-[calc(100dvh-8rem)] object-contain"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------ *
 * Showcase: the same slideshow, full bleed, with the project's own text
 * laid over it. Each slide is drawn twice: a blurred cover copy that fills
 * the card whatever its shape, and the real capture on top, cover-fitted
 * on a desktop and contained on a phone or for portrait captures, so a
 * phone screenshot is never cropped into a sliver.
 * ------------------------------------------------------------------ */
const SHOWCASE_SIZES = '(max-width: 1023px) calc(100vw - 2rem), 1152px';

export function ProjectShowcase({ project, priority = false, flipped = false, children }) {
  const { t } = useAppContext();
  const slides = imageManifest[project.id] ?? NO_SLIDES;
  const total = slides.length;
  const {
    index, direction, go, jump, multiple, running, playing, togglePlaying,
    frameRef, lightboxOpen, setLightboxOpen, reduceMotion, containerProps, hoverProps
  } = useSlideshow({ slides, projectId: project.id, sizes: SHOWCASE_SIZES });

  const slide = slides[index];
  const counter = multiple
    ? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    : null;
  const altFor = (s, i) =>
    s.caption
      ? `${project.title}: ${s.caption}`
      : fill(t.projects.slideAlt, { title: project.title, n: i + 1, total });

  const offset = reduceMotion ? 0 : 40;
  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir * offset, scale: reduceMotion ? 1 : 1.03 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0 }
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
  };

  return (
    <>
      <div
        ref={frameRef}
        role="region"
        aria-roledescription={t.projects.carouselRole}
        aria-label={fill(t.projects.galleryLabel, { title: project.title })}
        onKeyDown={multiple ? onKeyDown : undefined}
        {...containerProps}
        {...hoverProps}
        className="showcase neo-frame relative isolate overflow-hidden lg:min-h-[640px] flex"
      >
        {/* Slides */}
        <div className="absolute inset-0 z-0 bg-[#0d0c0b]">
          {slide ? (
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={slide.file}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0.01 : 0.8, ease: [0.22, 1, 0.36, 1] }}
                drag={multiple && !reduceMotion ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1);
                  else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1);
                }}
                className="absolute inset-0 touch-pan-y"
              >
                <img
                  src={slideSrc(project.id, slide, WIDTHS[0])}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 select-none pointer-events-none"
                />
                <img
                  src={slideSrc(project.id, slide, WIDTHS.at(-1))}
                  srcSet={slideSrcSet(project.id, slide)}
                  sizes={SHOWCASE_SIZES}
                  width={slide.width}
                  height={slide.height}
                  alt={altFor(slide, index)}
                  loading={priority && index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className={`showcase-shot absolute inset-x-0 top-0 w-full select-none pointer-events-none ${
                    slide.height > slide.width
                      ? `showcase-shot--portrait ${flipped ? 'showcase-shot--left' : 'showcase-shot--right'}`
                      : 'showcase-shot--landscape'
                  }`}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <span className="absolute inset-0 bg-stripes" aria-hidden="true" />
          )}
        </div>

        {/* Scrim: keeps the text legible without hiding the half of the
            capture the text is not sitting on. */}
        <div
          aria-hidden="true"
          className={`showcase-scrim absolute inset-0 z-10 pointer-events-none ${flipped ? 'showcase-scrim--flip' : ''}`}
        />

        {/* Top bar: progress, domain, controls */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center gap-3 p-3 sm:p-4">
          {multiple ? (
            <div className="flex-1 flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.file}
                  type="button"
                  onClick={() => jump(i)}
                  aria-label={altFor(s, i)}
                  aria-current={i === index ? 'true' : undefined}
                  className="group/seg flex-1 py-2 cursor-pointer"
                >
                  <span className="relative block h-1 bg-white/30 overflow-hidden group-hover/seg:bg-white/50 transition-colors">
                    {i < index && <span className="absolute inset-0 bg-[var(--accent)]" />}
                    {i === index && (
                      <span
                        key={index}
                        className="gallery-progress absolute inset-0 bg-[var(--accent)] origin-left"
                        style={{
                          animationDuration: `${SLIDE_MS}ms`,
                          animationPlayState: running ? 'running' : 'paused'
                        }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <span className="flex-1" />
          )}

          <span className="hidden sm:inline font-mono text-[10px] font-semibold text-white/85 bg-black/45 backdrop-blur px-2 py-1 border border-white/25 truncate max-w-[40%]">
            {chromeLabel(project)}
          </span>
          {counter && (
            <span className="font-mono text-[10px] font-bold tabular-nums text-white/85" aria-hidden="true">{counter}</span>
          )}
          {multiple && (
            <ShowcaseButton
              onClick={togglePlaying}
              label={playing ? t.projects.pauseSlideshow : t.projects.playSlideshow}
              pressed={!playing}
            >
              {playing ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
            </ShowcaseButton>
          )}
          {slide && (
            <ShowcaseButton onClick={() => setLightboxOpen(true)} label={t.projects.openGallery}>
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            </ShowcaseButton>
          )}
        </div>

        {multiple && (
          <div className={`showcase-arrows absolute z-30 flex gap-2 ${flipped ? 'showcase-arrows--left' : ''}`}>
            <StageArrow inline side="left" label={t.projects.prevSlide} onClick={() => go(-1)} />
            <StageArrow inline side="right" label={t.projects.nextSlide} onClick={() => go(1)} />
          </div>
        )}

        {/* The project's own text. Tokens are re-pointed to the dark palette
            here, so every tag, button and rule inside reads on the scrim in
            both themes without a second set of classes. */}
        <div className={`showcase-content on-scrim relative z-20 w-full lg:w-[56%] flex flex-col justify-end lg:justify-center ${flipped ? 'lg:ml-auto' : ''}`}>
          {children}
        </div>

        <p className="sr-only" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
          {multiple ? fill(t.projects.slideStatus, { n: index + 1, total }) : ''}
        </p>
      </div>

      {slide && (
        <Lightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          project={project}
          slide={slide}
          alt={altFor(slide, index)}
          counter={counter}
          onPrev={multiple ? () => go(-1) : null}
          onNext={multiple ? () => go(1) : null}
        />
      )}
    </>
  );
}

function ShowcaseButton({ onClick, label, pressed, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="w-8 h-8 shrink-0 inline-flex items-center justify-center border-2 border-white/70 bg-black/45 backdrop-blur text-white hover:bg-[var(--accent)] hover:text-[var(--on-accent)] hover:border-[var(--on-accent)] cursor-pointer transition-colors"
    >
      {children}
    </button>
  );
}
