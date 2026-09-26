import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Copy, Check, Send, MapPin, Download } from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { useAppContext } from '../context/app-context';
import { CV_PATH, CV_DOWNLOAD_NAME } from '../lib/cv';
import { toSentence } from '../lib/text';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl bg-[rgba(238,244,234,0.06)] border border-[var(--line)] text-[15px] text-[var(--ink)] placeholder:text-[var(--muted-color)] placeholder:opacity-70 hover:border-[var(--line-strong)] focus:border-[var(--accent)] focus:bg-[rgba(238,244,234,0.1)] focus:outline-none focus:ring-4 focus:ring-[rgba(216,168,76,0.18)] transition-[border-color,background-color,box-shadow] duration-200';

const LABEL_CLASS =
  'block text-[13px] font-medium text-[var(--muted-color)] mb-1.5';

export default function ContactFooter() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalData.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* Clipboard access can be denied; the address sits next to it as text. */
    }
  };

  /* No backend and no third-party form service: the visitor's own mail client
     opens with the message prefilled, which is what the note under the form
     promises. Nothing leaves the page on its own. */
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();

    const subject = `Portfolio contact — ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;

    window.location.href =
      `mailto:${personalData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <footer id="contact" className="pt-10 pb-8 relative z-10 bg-[var(--bg-color)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={reduceMotion ? false : { y: 40, scale: 0.98 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bottle-region bottle-grain bg-grid-neo rounded-[var(--radius-xl)] overflow-hidden p-7 sm:p-10 lg:p-14 mb-10 shadow-[var(--shadow-lg)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            <div className="lg:col-span-7 flex flex-col items-start">
              <h2 className="font-heading font-bold text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[0.98] tracking-[-0.04em] text-[var(--ink)] mb-6 text-balance">
                {t.contact.title}
              </h2>

              <p className="text-[var(--muted-color)] text-base sm:text-[17px] leading-relaxed mb-6 max-w-[52ch]">
                {t.contact.description}
              </p>

              <p className="inline-flex items-center gap-2 text-sm text-[var(--ink)] mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--mint)]" aria-hidden="true" />
                {t.contact.availability}
              </p>

              {/* The address is a selectable span, not button text: someone who
                  wants to paste it into their own client should not have to
                  trust a clipboard API that a locked-down browser may refuse. */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-[var(--line-strong)] flex items-stretch overflow-hidden">
                  <span className="flex items-center gap-2.5 px-5 py-3.5 text-[15px] text-[var(--ink)] select-all">
                    <Mail className="w-4 h-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    {personalData.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={t.contact.copyEmail}
                    className="px-4 border-l border-[var(--line-strong)] flex items-center text-[var(--ink)] cursor-pointer hover:bg-[var(--accent)] hover:text-[var(--on-accent)] transition-colors"
                  >
                    {copied
                      ? <Check className="w-4 h-4" aria-hidden="true" />
                      : <Copy className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </div>

                <span className="text-sm text-[var(--accent)] font-medium" role="status" aria-live="polite">
                  {copied ? t.contact.copied : ''}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-6">
                <SocialLink href={personalData.github} label="GitHub"><Github className="w-[18px] h-[18px]" /></SocialLink>
                <SocialLink href={personalData.linkedin} label="LinkedIn"><Linkedin className="w-[18px] h-[18px]" /></SocialLink>
                <SocialLink href={personalData.whatsapp} label="WhatsApp"><Whatsapp className="w-[18px] h-[18px]" /></SocialLink>

                <a href={CV_PATH} download={CV_DOWNLOAD_NAME} className="neo-btn btn-ghost ml-1">
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>{t.hero.downloadCv}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[rgba(0,0,0,0.16)] p-6 sm:p-7">
                <h3 className="font-heading font-semibold text-xl text-[var(--ink)] tracking-[-0.015em] mb-5 flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                  {t.contact.formTitle}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className={LABEL_CLASS}>{t.contact.nameLabel}</label>
                    <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder={t.contact.namePlaceholder} className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={LABEL_CLASS}>{t.contact.emailLabel}</label>
                    <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder={t.contact.emailPlaceholder} className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className={LABEL_CLASS}>{t.contact.messageLabel}</label>
                    <textarea id="contact-message" name="message" required rows={4} placeholder={t.contact.messagePlaceholder} className={`${INPUT_CLASS} resize-none`} />
                  </div>

                  <button type="submit" className="neo-btn btn-brass w-full !py-3.5 mt-1 group">
                    <span>{toSentence(t.contact.sendBtn)}</span>
                    <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </button>

                  <p className="text-[12px] text-[var(--muted-color)] leading-relaxed">
                    {t.contact.formNote}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-color)]">
          <p className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span className="text-[var(--ink)] font-medium">© {new Date().getFullYear()} {personalData.name}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {personalData.location}
            </span>
          </p>

          <p className="font-heading italic text-[var(--ink)] order-first sm:order-none">{t.contact.tagline}</p>

          <nav className="flex items-center gap-1" aria-label="Footer">
            <FooterLink href={personalData.linkedin}>LinkedIn</FooterLink>
            <FooterLink href={personalData.github}>GitHub</FooterLink>
            <FooterLink href={`mailto:${personalData.email}`}>Email</FooterLink>
          </nav>
        </div>

      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full border border-[var(--line-strong)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] hover:border-transparent transition-colors flex items-center justify-center text-[var(--ink)]"
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }) {
  const isExternal = href.startsWith('http');
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="px-3 py-1.5 rounded-lg hover:bg-[var(--card-color)] hover:text-[var(--ink)] transition-colors"
    >
      {children}
    </a>
  );
}
