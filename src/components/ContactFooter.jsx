import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Copy, Check, Send, MapPin, Download } from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { useAppContext } from '../context/app-context';
import { CV_PATH, CV_DOWNLOAD_NAME } from '../lib/cv';
import { toSentence } from '../lib/text';

const INPUT_CLASS =
  'w-full px-4 py-3 clay-well !rounded-2xl text-[15px] text-[var(--ink)] placeholder:text-[var(--muted-color)] placeholder:opacity-80 focus:outline-none focus:ring-4 focus:ring-[color-mix(in_oklab,var(--accent)_35%,transparent)] transition-shadow duration-200';

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
    <footer id="contact" className="pt-10 pb-8 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={reduceMotion ? false : { y: 60, scale: 0.95 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="clay clay-violet !rounded-[48px] p-7 sm:p-10 lg:p-14 mb-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            <div className="lg:col-span-7 flex flex-col items-start">
              <h2 className="font-heading font-bold text-[clamp(2.4rem,5.4vw,4.4rem)] leading-[0.98] tracking-[-0.025em] mb-6 text-balance">
                {t.contact.title}
              </h2>

              <p className="opacity-90 text-base sm:text-[17px] leading-relaxed mb-6 max-w-[52ch]">
                {t.contact.description}
              </p>

              <p className="inline-flex items-center gap-2 text-sm font-semibold mb-8 clay clay-butter !rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                {t.contact.availability}
              </p>

              {/* The address is a selectable span, not button text: someone who
                  wants to paste it into their own client should not have to
                  trust a clipboard API that a locked-down browser may refuse. */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="clay !rounded-full flex items-stretch overflow-hidden text-[var(--ink)]">
                  <span className="flex items-center gap-2.5 pl-5 pr-3 py-3.5 text-[15px] select-all">
                    <Mail className="w-4 h-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    {personalData.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={t.contact.copyEmail}
                    className="px-4 flex items-center text-[var(--ink)] cursor-pointer hover:text-[var(--accent)] transition-colors"
                  >
                    {copied
                      ? <Check className="w-4 h-4" aria-hidden="true" />
                      : <Copy className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </div>

                <span className="text-sm font-semibold" role="status" aria-live="polite">
                  {copied ? t.contact.copied : ''}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-6">
                <SocialLink href={personalData.github} label="GitHub"><Github className="w-[18px] h-[18px]" /></SocialLink>
                <SocialLink href={personalData.linkedin} label="LinkedIn"><Linkedin className="w-[18px] h-[18px]" /></SocialLink>
                <SocialLink href={personalData.whatsapp} label="WhatsApp"><Whatsapp className="w-[18px] h-[18px]" /></SocialLink>

                <a href={CV_PATH} download={CV_DOWNLOAD_NAME} className="neo-btn ml-1">
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>{t.hero.downloadCv}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <div className="clay !rounded-[36px] p-6 sm:p-7 text-[var(--ink)]">
                <h3 className="font-heading font-semibold text-xl text-[var(--ink)] mb-5 flex items-center gap-2.5">
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

                  <button type="submit" className="neo-btn btn-primary w-full !py-3.5 mt-1 group">
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

          <p className="font-heading font-medium text-[var(--ink)] order-first sm:order-none">{t.contact.tagline}</p>

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
      className="w-11 h-11 rounded-full clay clay-press flex items-center justify-center text-[var(--ink)]"
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
      className="px-3.5 py-1.5 rounded-full font-semibold hover:bg-[var(--card-color)] hover:text-[var(--ink)] transition-colors"
    >
      {children}
    </a>
  );
}
