import React, { useState } from 'react';
import { Mail, Copy, Check, Send, MapPin, Sparkles, Download } from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './Icons';
import { useAppContext } from '../context/app-context';
import { CV_PATH, CV_DOWNLOAD_NAME } from '../lib/cv';

const INPUT_CLASS =
  'w-full px-3.5 py-2.5 bg-[var(--bg-color)] border-2 border-[var(--ink)] font-mono text-xs sm:text-sm text-[var(--ink)] placeholder:text-[var(--muted-color)] focus:bg-[var(--card-color)] focus:shadow-[2px_2px_0px_var(--ink)] transition-all';

const LABEL_CLASS =
  'block font-mono text-xs font-bold text-[var(--ink)] uppercase mb-1';

export default function ContactFooter() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;
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
    <footer id="contact" className="pt-14 pb-8 relative z-10 bg-[var(--bg-color)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-[var(--accent)] border-2 border-[var(--ink)] shadow-[5px_5px_0px_var(--ink)] p-8 sm:p-10 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="neo-section-label bg-[var(--card-color)] text-[var(--ink)] mb-4">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>{t.contact.label}</span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--on-accent)] mb-4 leading-tight text-balance">
                {t.contact.title}
              </h2>

              <p className="text-[var(--on-accent)] font-medium text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
                {t.contact.description}
              </p>

              {/* The three facts a recruiter checks before replying. */}
              <p className="font-mono text-xs sm:text-sm font-bold text-[var(--on-accent)] border-y-2 border-[var(--on-accent)] py-2.5 mb-6">
                {t.contact.availability}
              </p>

              {/* The address is a selectable span, not button text: someone who
                  wants to paste it into their own client should not have to
                  trust a clipboard API that a locked-down browser may refuse. */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-[var(--card-color)] border-2 border-[var(--ink)] shadow-[3px_3px_0px_var(--ink)] flex items-stretch">
                  <span className="flex items-center gap-2 px-4 py-3 font-mono text-xs sm:text-sm text-[var(--ink)] select-all">
                    <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {personalData.email}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label={t.contact.copyEmail}
                    className="px-3 border-l-2 border-[var(--ink)] flex items-center text-[var(--ink)] cursor-pointer hover:bg-[var(--accent)] transition-colors"
                  >
                    {copied
                      ? <Check className="w-4 h-4" aria-hidden="true" />
                      : <Copy className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </div>

                <span className="neo-tag on-accent bg-[var(--accent-lime)] font-bold" role="status" aria-live="polite">
                  {copied ? t.contact.copied : ''}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-7">
                <SocialLink href={personalData.github} label="GitHub"><Github className="w-5 h-5" /></SocialLink>
                <SocialLink href={personalData.linkedin} label="LinkedIn"><Linkedin className="w-5 h-5" /></SocialLink>
                <SocialLink href={personalData.whatsapp} label="WhatsApp"><Whatsapp className="w-5 h-5" /></SocialLink>

                <a
                  href={CV_PATH}
                  download={CV_DOWNLOAD_NAME}
                  className="neo-btn bg-[var(--ink)] text-[var(--bg-color)] text-xs py-2.5 px-4 border-2 shadow-[2px_2px_0px_var(--ink)]"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>{t.hero.downloadCv}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="neo-card-flat p-6 sm:p-8">
                <div className="neo-section-label on-accent bg-[var(--accent-lime)] mb-6">
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>{t.contact.formTitle}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className={LABEL_CLASS}>{t.contact.nameLabel}</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder={t.contact.namePlaceholder}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={LABEL_CLASS}>{t.contact.emailLabel}</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder={t.contact.emailPlaceholder}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={LABEL_CLASS}>{t.contact.messageLabel}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      placeholder={t.contact.messagePlaceholder}
                      className={`${INPUT_CLASS} resize-none`}
                    />
                  </div>

                  <button type="submit" className="neo-btn bg-[var(--ink)] text-[var(--bg-color)] w-full mt-2">
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>{t.contact.sendBtn}</span>
                  </button>

                  <p className="font-mono text-[10px] text-[var(--muted-color)] leading-relaxed pt-1">
                    {t.contact.formNote}
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>

        <p className="my-6 text-center font-mono font-bold text-sm sm:text-base text-[var(--ink)] tracking-wider uppercase">
          {t.contact.tagline}
        </p>

        <div className="border-t-[3px] border-[var(--ink)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-medium text-[var(--ink)]">
          <p className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold">© {new Date().getFullYear()} {personalData.name}</span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              {personalData.location}
            </span>
          </p>

          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Footer">
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
      className="p-2.5 bg-[var(--card-color)] border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--ink)] transition-all flex items-center justify-center text-[var(--ink)]"
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
      className="px-2.5 py-1 border-2 border-transparent hover:border-[var(--ink)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)] transition-all font-bold"
    >
      {children}
    </a>
  );
}
