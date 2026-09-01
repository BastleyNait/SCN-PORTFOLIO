import React, { useState } from 'react';
import { Mail, Copy, Check, Send, MapPin, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ContactFooter() {
  const { t, data } = useAppContext();
  const personalData = data.personalData;
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <footer id="contact" className="pt-20 pb-8 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main CTA Banner Card */}
        <div className="bg-[#27f5a9] border-[3px] border-[var(--black-color)] shadow-[8px_8px_0px_var(--black-color)] p-8 sm:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Info Column (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="neo-section-label bg-[var(--card-color)] text-[var(--black-color)] mb-4">
                <Sparkles className="w-4 h-4" />
                <span>{t.contact.label}</span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[var(--black-color)] mb-4 leading-tight">
                {t.contact.title}
              </h2>

              <p className="text-[var(--black-color)] font-medium text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                {t.contact.description}
              </p>

              {/* Copy Email Button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="neo-btn bg-[var(--card-color)] text-[var(--black-color)] hover:bg-stone-50 font-mono text-xs sm:text-sm normal-case tracking-normal py-3 px-5"
                >
                  <Mail className="w-4 h-4" />
                  <span>{personalData.email}</span>
                  <div className="ml-2 pl-2 border-l-2 border-[var(--black-color)] flex items-center">
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[var(--black-color)]" />
                    )}
                  </div>
                </button>

                {copied && (
                  <span className="neo-tag bg-emerald-300 text-[var(--black-color)] font-mono text-xs font-bold animate-pulse">
                    <span>{t.contact.copied}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Right Form Column (5 cols on lg) */}
            <div className="lg:col-span-5">
              <div className="neo-card p-6 sm:p-8 bg-[var(--card-color)]">
                <div className="neo-section-label bg-[#a3e635] text-[var(--black-color)] mb-6">
                  <Send className="w-4 h-4" />
                  <span>{t.contact.formTitle}</span>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block font-mono text-xs font-bold text-[var(--black-color)] uppercase mb-1">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name / Company"
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border-[3px] border-[var(--black-color)] rounded-none font-mono text-xs sm:text-sm text-[var(--black-color)] placeholder:text-stone-400 focus:outline-none focus:bg-[var(--card-color)] focus:shadow-[3px_3px_0px_var(--black-color)] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-mono text-xs font-bold text-[var(--black-color)] uppercase mb-1">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tuemail@ejemplo.com"
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border-[3px] border-[var(--black-color)] rounded-none font-mono text-xs sm:text-sm text-[var(--black-color)] placeholder:text-stone-400 focus:outline-none focus:bg-[var(--card-color)] focus:shadow-[3px_3px_0px_var(--black-color)] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-mono text-xs font-bold text-[var(--black-color)] uppercase mb-1">
                      {t.contact.messageLabel}
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={t.contact.messagePlaceholder}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-color)] border-[3px] border-[var(--black-color)] rounded-none font-mono text-xs sm:text-sm text-[var(--black-color)] placeholder:text-stone-400 focus:outline-none focus:bg-[var(--card-color)] focus:shadow-[3px_3px_0px_var(--black-color)] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="neo-btn bg-[var(--black-color)] text-white hover:bg-black hover:text-[#27f5a9] w-full mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.sendBtn}</span>
                  </button>

                  {formSubmitted && (
                    <div className="neo-tag bg-emerald-300 text-[var(--black-color)] text-center font-bold text-xs py-2 px-3 justify-center">
                      {t.contact.successMsg}
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Tagline separator */}
        <div className="my-8 text-center">
          <p className="font-mono font-bold text-sm sm:text-base text-[var(--black-color)] tracking-wider uppercase">
            {t.contact.tagline}
          </p>
        </div>

        {/* Footer Sub-bar */}
        <div className="border-t-[3px] border-[var(--black-color)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-medium text-[var(--black-color)]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold">© 2026 {personalData.name}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {personalData.location || "Arequipa, Peru"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href={personalData.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2.5 py-1 border-2 border-transparent hover:border-[var(--black-color)] hover:bg-[#27f5a9] transition-all font-bold"
            >
              LinkedIn
            </a>
            <a 
              href={personalData.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2.5 py-1 border-2 border-transparent hover:border-[var(--black-color)] hover:bg-[#27f5a9] transition-all font-bold"
            >
              GitHub
            </a>
            <a 
              href={`mailto:${personalData.email}`} 
              className="px-2.5 py-1 border-2 border-transparent hover:border-[var(--black-color)] hover:bg-[#27f5a9] transition-all font-bold"
            >
              Email
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
