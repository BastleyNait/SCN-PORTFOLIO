import React, { useState } from 'react';
import { Mail, Copy, Check, Send, MapPin, Sparkles } from 'lucide-react';
import { personalData } from '../data/portfolioData';

export default function ContactFooter() {
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
        <div className="bg-[#27f5a9] border-[3px] border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] p-8 sm:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Info Column (7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="neo-section-label bg-white text-[#1a1a1a] mb-4">
                <Sparkles className="w-4 h-4" />
                <span>¿HABLAMOS?</span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#1a1a1a] mb-4 leading-tight">
                Construyamos algo extraordinario.
              </h2>

              <p className="text-[#1a1a1a] font-medium text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                Estoy disponible para incorporarme a equipos innovadores, liderar desarrollo Systems Engineer o colaborar en soluciones de alto rendimiento con Inteligencia Artificial.
              </p>

              {/* Copy Email Button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="neo-btn bg-white text-[#1a1a1a] hover:bg-stone-50 font-mono text-xs sm:text-sm normal-case tracking-normal py-3 px-5"
                >
                  <Mail className="w-4 h-4" />
                  <span>{personalData.email}</span>
                  <div className="ml-2 pl-2 border-l-2 border-[#1a1a1a] flex items-center">
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#1a1a1a]" />
                    )}
                  </div>
                </button>

                {copied && (
                  <span className="neo-tag bg-emerald-300 text-[#1a1a1a] font-mono text-xs font-bold animate-pulse">
                    ¡Email copiado al portapapeles!
                  </span>
                )}
              </div>
            </div>

            {/* Right Form Column (5 cols on lg) */}
            <div className="lg:col-span-5">
              <div className="neo-card p-6 sm:p-8 bg-white">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h3 className="font-heading font-black text-base sm:text-lg text-[#1a1a1a] uppercase tracking-wide mb-1">
                    Enviar Mensaje Directo
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs font-bold text-[#1a1a1a] uppercase">
                      Tu Nombre / Empresa
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu Nombre / Empresa"
                      className="w-full px-3.5 py-2.5 bg-[#fffdf7] border-[3px] border-[#1a1a1a] rounded-none font-mono text-xs sm:text-sm text-[#1a1a1a] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0px_#1a1a1a] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs font-bold text-[#1a1a1a] uppercase">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tuemail@ejemplo.com"
                      className="w-full px-3.5 py-2.5 bg-[#fffdf7] border-[3px] border-[#1a1a1a] rounded-none font-mono text-xs sm:text-sm text-[#1a1a1a] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0px_#1a1a1a] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs font-bold text-[#1a1a1a] uppercase">
                      Mensaje
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="¿En qué te puedo ayudar?"
                      className="w-full px-3.5 py-2.5 bg-[#fffdf7] border-[3px] border-[#1a1a1a] rounded-none font-mono text-xs sm:text-sm text-[#1a1a1a] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0px_#1a1a1a] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="neo-btn bg-[#1a1a1a] text-white hover:bg-black hover:text-[#27f5a9] w-full mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>ENVIAR MENSAJE</span>
                  </button>

                  {formSubmitted && (
                    <div className="neo-tag bg-emerald-300 text-[#1a1a1a] text-center font-bold text-xs py-2 px-3 justify-center">
                      ¡Gracias por tu mensaje! Me pondré en contacto muy pronto.
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Tagline separator */}
        <div className="my-8 text-center">
          <p className="font-mono font-bold text-sm sm:text-base text-[#1a1a1a] tracking-wider uppercase">
            ✦ Always learning, always building. ✦
          </p>
        </div>

        {/* Footer Sub-bar */}
        <div className="border-t-[3px] border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-medium text-[#1a1a1a]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-bold">© 2026 {personalData.name}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {personalData.location || "Arequipa, Perú"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href={personalData.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2.5 py-1 border-2 border-transparent hover:border-[#1a1a1a] hover:bg-[#27f5a9] transition-all font-bold"
            >
              LinkedIn
            </a>
            <a 
              href={personalData.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2.5 py-1 border-2 border-transparent hover:border-[#1a1a1a] hover:bg-[#27f5a9] transition-all font-bold"
            >
              GitHub
            </a>
            <a 
              href={`mailto:${personalData.email}`} 
              className="px-2.5 py-1 border-2 border-transparent hover:border-[#1a1a1a] hover:bg-[#27f5a9] transition-all font-bold"
            >
              Email
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
