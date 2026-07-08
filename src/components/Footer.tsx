import React from "react";
import { Compass, MapPin, Shield, Star, Heart, FileText, Landmark, Instagram, Twitter, Mail } from "lucide-react";
import { motion } from "motion/react";
import Logo from "./Logo";

interface FooterProps {
  onSetSection: (sec: string) => void;
  onOpenPrivacy: () => void;
  onOpenCookie: () => void;
  onOpenTerms: () => void;
  onOpenDisclaimer: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSetSection,
  onOpenPrivacy,
  onOpenCookie,
  onOpenTerms,
  onOpenDisclaimer
}) => {
  return (
    <footer className="bg-alpine-charcoal border-t border-alpine-burgundy/10 text-white select-none relative overflow-hidden">
      {/* Decorative starry backdrop ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(124,28,28,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-accent/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative z-10 space-y-16">
        
        {/* Main Grid: 4 Premium Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
          
          {/* Column 1: Brand & Logo */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo className="h-11 w-auto" variant="original" />
              <div>
                <h3 className="text-sm font-serif font-black uppercase tracking-widest text-alpine-cream m-0">
                  Alpine Goat Adventure
                </h3>
                <span className="text-[10px] font-mono tracking-widest text-gold-accent font-bold">
                  HIMALAYAN PLANNERS
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              We are located at our office in Shanti Niwas, Taradevi, Shimla. We operate legally, and for specialized zones we take permission from authorities. Our tour experts will help you the whole tour — please cooperate with them and follow what our guides say, as we have experts and we know what we do.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-300 font-semibold leading-snug">
                <MapPin className="w-4 h-4 text-alpine-burgundy shrink-0 mt-0.5" />
                <span>
                  Shanti Niwas, village Badhai Sankatmochan, <br />
                  PO Bagh, Taradevi, Shimla, Himachal Pradesh 171010
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold font-mono">
                <Compass className="w-4 h-4 text-gold-accent shrink-0" />
                <span>31.0831° N, 77.1443° E</span>
              </div>
            </div>
          </div>

          {/* Column 2: Curated Navigation Nodes */}
          <div className="space-y-6">
            <h4 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-gold-accent border-b border-white/10 pb-2">
              Curated Navigation
            </h4>
            <ul className="space-y-3 text-xs font-semibold p-0 m-0 list-none">
              {[
                { label: "Home Base", sec: "hero" },
                { label: "Private Catalog", sec: "expeditions" },
                { label: "Signature Services", sec: "services" },
                { label: "Adventure Fleet", sec: "fleet" },
                { label: "Bespoke Trip Builder", sec: "custom-trip" },
                { label: "Safety Pillars", sec: "safety" },
                { label: "Traveler Chronologies", sec: "stories" },
                { label: "Logistics Desk", sec: "contact" }
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onSetSection(link.sec)}
                    className="text-slate-300 hover:text-white hover:translate-x-1.5 transition-all bg-transparent border-0 p-0 cursor-pointer outline-none font-semibold text-left"
                  >
                    ✦ {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal, Disclaimers & Policies */}
          <div className="space-y-6">
            <h4 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-gold-accent border-b border-white/10 pb-2">
              Regulatory & Policy
            </h4>
            <ul className="space-y-3 text-xs font-semibold p-0 m-0 list-none">
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="text-slate-300 hover:text-white hover:translate-x-1 transition-all bg-transparent border-0 p-0 cursor-pointer outline-none flex items-center gap-2 font-semibold text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-alpine-burgundy" />
                  Privacy Policy File
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCookie}
                  className="text-slate-300 hover:text-white hover:translate-x-1 transition-all bg-transparent border-0 p-0 cursor-pointer outline-none flex items-center gap-2 font-semibold text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-alpine-burgundy" />
                  Cookies & Trackers Protocol
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="text-slate-300 hover:text-white hover:translate-x-1 transition-all bg-transparent border-0 p-0 cursor-pointer outline-none flex items-center gap-2 font-semibold text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-alpine-burgundy" />
                  Terms of Carriage & Service
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDisclaimer}
                  className="text-slate-300 hover:text-white hover:translate-x-1 transition-all bg-transparent border-0 p-0 cursor-pointer outline-none flex items-center gap-2 font-semibold text-left"
                >
                  <Landmark className="w-3.5 h-3.5 text-alpine-burgundy" />
                  Alpine Risk Disclaimers
                </button>
              </li>
            </ul>

            <div className="pt-2 bg-alpine-burgundy/5 border border-alpine-burgundy/15 p-4 rounded-xl space-y-2">
              <span className="text-[9px] font-mono text-alpine-burgundy uppercase font-extrabold block">
                🚨 Himalayan Travel Notice
              </span>
              <p className="text-[10px] text-slate-300 m-0 leading-relaxed font-semibold">
                We operate legally, and for specialized zones we take permission from authorities. Our tour experts will support you the whole tour and help guide you along the way.
              </p>
            </div>
          </div>

          {/* Column 4: Environmental & Affiliations */}
          <div className="space-y-6">
            <h4 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-gold-accent border-b border-white/10 pb-2">
              Affiliations & Eco-Code
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              We support sustainable mountain waste management and organic farming initiatives across Spiti communities.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <Heart className="w-4 h-4 text-emerald-400 animate-pulse" />
                Zero-Carbon Campsite Standard
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 font-semibold uppercase tracking-wider">
                <Star className="w-4 h-4 text-gold-accent" />
                Himachal Tourism Vetted Agent
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 font-semibold uppercase tracking-wider">
                <Shield className="w-4 h-4 text-alpine-burgundy" />
                Copyright & IP Protection Protocol
              </div>
            </div>

            {/* Social Media Coordinates */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h5 className="text-[10px] font-mono font-black uppercase tracking-[0.15em] text-gold-accent">
                Direct Coordinates
              </h5>
              <div className="space-y-2.5">
                <a
                  href="https://instagram.com/alpinegoatadventure"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors group font-semibold"
                >
                  <Instagram className="w-4.5 h-4.5 text-alpine-burgundy group-hover:scale-110 transition-transform" />
                  <span>@alpinegoatadventure</span>
                </a>
                <a
                  href="https://twitter.com/alpinegoatadv"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors group font-semibold"
                >
                  <Twitter className="w-4.5 h-4.5 text-alpine-burgundy group-hover:scale-110 transition-transform" />
                  <span>@alpinegoatadv</span>
                </a>
                <a
                  href="mailto:alpinegoatadventure@gmail.com"
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors group font-semibold"
                >
                  <Mail className="w-4.5 h-4.5 text-alpine-burgundy group-hover:scale-110 transition-transform" />
                  <span>alpinegoatadventure@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Divider line */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-slate-400 font-semibold text-center md:text-left space-y-1">
            <p className="m-0">
              © {new Date().getFullYear()} Alpine Goat Adventure Private Limited. All rights reserved.
            </p>
          </div>

          {/* Elite Designer Credit */}
          <div className="flex items-center justify-center">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes goldShimmer {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}} />
            <a
              href="https://anantbhardwaj.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center gap-1.5 px-6 py-3 rounded-lg bg-slate-950/40 backdrop-blur-md border border-white/5 hover:border-gold-accent/30 hover:bg-slate-950/80 transition-all duration-500 shadow-2xl text-center"
            >
              {/* Premium Top Sub-Label */}
              <div className="text-[8px] text-slate-500 group-hover:text-gold-accent transition-colors uppercase tracking-[0.3em] font-mono leading-none">
                Developed By
              </div>
              
              {/* Luxury Designer Name */}
              <div className="font-serif text-sm tracking-[0.18em] font-semibold text-white transition-all duration-300">
                <span
                  style={{
                    backgroundImage: "linear-gradient(90deg, #dfc585, #f3e7c4, #b89047, #f3e7c4, #dfc585)",
                    backgroundSize: "400% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "goldShimmer 8s linear infinite",
                    textShadow: "0 0 12px rgba(223, 197, 133, 0.15)"
                  }}
                  className="font-bold font-serif"
                >
                  ANXNTBHARDWAJ
                </span>
              </div>

              {/* Exclusive Bottom Label */}
              <div className="text-[7.5px] sm:text-[8px] text-slate-400 group-hover:text-white uppercase tracking-[0.18em] transition-all duration-300 pt-1.5 mt-1 border-t border-white/5 w-full font-mono font-medium">
                software developer & cyber security researcher
              </div>
              <div className="text-[6.5px] sm:text-[7px] text-slate-500 group-hover:text-gold-accent uppercase tracking-[0.25em] transition-all duration-300 mt-1 font-mono font-bold">
                click to connect
              </div>
            </a>
          </div>

          {/* Brand Credits block in page margin - literal & clean */}
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            <span>Our Office, Shimla</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Live Support</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
