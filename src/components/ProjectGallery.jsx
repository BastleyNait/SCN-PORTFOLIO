import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, ImageOff } from 'lucide-react';
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

export default function ProjectGallery({ project, priority = false }) {
  const { t } = useAppContext();
  const reduceMotion = useReducedMotion();
  const slides = imageManifest[project.id] ?? NO_SLIDES;
  const total = slides.length;
  const ratio = stageRatio(slides);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dragged = useRef(false);
  const touched = useRef(false);

  const go = useCallback((step) => {
    if (total < 2) return;
    touched.current = true;
    setDirection(step);
    setIndex((current) => (current + step + total) % total);
  }, [total]);

  const jump = (next) => {
    touched.current = true;
    setDirection(next >= index ? 1 : -1);
    setIndex(next);
  };

  /* Neighbours are fetched only once the visitor starts browsing, so six
     galleries sitting below the fold cost one image each, not all of them. */
  useEffect(() => {
    if (!touched.current || total < 2) return;
    for (const step of [1, -1]) {
      const slide = slides[(index + step + total) % total];
      const img = new Image();
      img.sizes = STAGE_SIZES;
      img.srcset = slideSrcSet(project.id, slide);
    }
  }, [index, total, slides, project.id]);

  if (total === 0) {
    return (
      <Frame project={project} counter={null}>
        <div className="relative aspect-video flex flex-col items-center justify-center gap-2 bg-stripes text-[var(--muted-color)]">
          <ImageOff className="w-8 h-8" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-wider">{project.title}</span>
        </div>
      </Frame>
    );
  }

  const slide = slides[index];
  const multiple = total > 1;
  const counter = multiple
    ? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    : null;
  const altFor = (s, i) =>
    s.caption
      ? `${project.title}: ${s.caption}`
      : fill(t.projects.slideAlt, { title: project.title, n: i + 1, total });

  const offset = reduceMotion ? 0 : 48;
  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir * offset }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -offset })
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
  };

  return (
    <>
      <Frame
        project={project}
        counter={counter}
        onExpand={() => setLightboxOpen(true)}
        expandLabel={t.projects.openGallery}
      >
        <div
          role="region"
          aria-roledescription={t.projects.carouselRole}
          aria-label={fill(t.projects.galleryLabel, { title: project.title })}
          onKeyDown={multiple ? onKeyDown : undefined}
          className="relative"
        >
          <div
            className="relative overflow-hidden bg-stripes bg-[var(--bg-color)]"
            style={{ aspectRatio: `${1 / ratio}` }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.button
                key={slide.file}
                type="button"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
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

            {multiple && (
              <>
                <StageArrow side="left" label={t.projects.prevSlide} onClick={() => go(-1)} />
                <StageArrow side="right" label={t.projects.nextSlide} onClick={() => go(1)} />
              </>
            )}
          </div>

          {/* The index is announced once per change, not on every render. */}
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {multiple ? fill(t.projects.slideStatus, { n: index + 1, total }) : ''}
          </p>

          {multiple && (
            <ul className="flex gap-2 p-2 overflow-x-auto border-t-[3px] border-[var(--ink)] bg-[var(--bg-color)] list-none m-0">
              {slides.map((s, i) => {
                const active = i === index;
                return (
                  <li key={s.file} className="shrink-0">
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
function Frame({ project, counter, onExpand, expandLabel, children }) {
  return (
    <div className="neo-frame overflow-hidden">
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
}

function StageArrow({ side, label, onClick }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-3' : 'right-3'} z-20 w-10 h-10 inline-flex items-center justify-center border-2 border-[var(--ink)] bg-[var(--card-color)] text-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] cursor-pointer transition-[transform,box-shadow,background-color] duration-100 hover:bg-[var(--accent)] hover:text-[var(--on-accent)] hover:shadow-[3px_3px_0px_var(--ink)] active:shadow-none active:translate-x-0.5`}
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
              {counter && (
                <span className="font-mono text-xs font-bold tabular-nums text-[var(--muted-color)]">{counter}</span>
              )}
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
            {onPrev && <StageArrow side="left" label={t.projects.prevSlide} onClick={onPrev} />}
            {onNext && <StageArrow side="right" label={t.projects.nextSlide} onClick={onNext} />}
          </div>
        </div>
      )}
    </dialog>
  );
}
