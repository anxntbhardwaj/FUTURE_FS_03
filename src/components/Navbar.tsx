import { useState, useEffect } from 'react';
import { Menu, X, Compass, Phone, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

interface NavbarProps {
  currentUser?: any;
  profile?: any;
  onSetSection: (section: string) => void;
  onRequestQuote: () => void;
}

export default function Navbar({ onSetSection, onRequestQuote }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (sectionId: string) => {
    onSetSection(sectionId);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Expeditions', target: 'expeditions' },
    { label: 'Services', target: 'services' },
    { label: 'Fleet', target: 'fleet' },
    { label: 'Custom Trip', target: 'custom-trip' },
    { label: 'Safety', target: 'safety' },
    { label: 'Stories', target: 'stories' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <>
      <nav id="app-navbar" className="fixed top-0 left-0 w-full z-40 bg-alpine-cream-light/90 backdrop-blur-md border-b border-alpine-burgundy/10 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Brand area with requested full alpine logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLinkClick('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Logo className="h-11 w-auto" variant="original" />
            <div className="flex flex-col">
              <p className="font-serif text-sm sm:text-lg font-bold tracking-tight text-alpine-charcoal m-0 group-hover:text-alpine-burgundy transition-colors leading-tight whitespace-nowrap">
                Alpine Goat Adventure
              </p>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-alpine-burgundy font-bold m-0 leading-none whitespace-nowrap">
                India's Premium Planners
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {menuItems.map((item) => (
              <motion.button
                key={item.target}
                whileHover={{ y: -1, scale: 1.06, color: "#7C1C1C" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLinkClick(item.target)}
                className="text-xs font-sans tracking-tight text-alpine-charcoal/80 hover:text-alpine-burgundy transition-colors py-2 font-semibold outline-none cursor-pointer border-none bg-transparent"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right Area (Quote Request, Call Buttons) */}
          <div className="hidden lg:flex items-center gap-3.5">
            <a
              href="https://wa.me/918894699271?text=Hello%20Alpine%20Goat%20Adventure!%20I%20would%20like%20to%20plan%20a%20private%20Himalayan%20expedition."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-[#25D366] bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-bold transition-all text-xs uppercase tracking-wider outline-none shadow-sm cursor-pointer decoration-none"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Base
            </a>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(251, 191, 36, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onRequestQuote}
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-alpine-charcoal rounded-full px-5 py-2 text-xs font-black uppercase tracking-widest shadow cursor-pointer transition-all outline-none border-none"
            >
              Custom Route
            </motion.button>
          </div>

          {/* Hamburger Menu icon for mobile */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-alpine-cream border border-alpine-burgundy/15 text-alpine-charcoal outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-alpine-cream/98 backdrop-blur-lg flex flex-col items-center lg:hidden overflow-y-auto no-scrollbar pt-28 pb-12"
          >
            <div className="flex flex-col items-center gap-5 text-center px-6 w-full max-w-sm">
              <Logo className="h-16 w-auto" variant="original" />
              <p className="font-serif text-2xl font-bold text-alpine-charcoal mb-4">Alpine Goat Menu</p>
              
              {menuItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => handleLinkClick(item.target)}
                  className="text-lg font-serif text-alpine-charcoal/90 hover:text-alpine-burgundy transition-colors font-bold outline-none border-none bg-transparent cursor-pointer"
                >
                  {item.label}
                </button>
              ))}

              <div className="w-full h-[1px] bg-alpine-burgundy/10 my-3" />

              <a
                href="https://wa.me/918894699271?text=Hello%20Alpine%20Goat%20Adventure!%20I%20would%20like%20to%20plan%20a%20private%20Himalayan%20expedition."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl font-bold text-sm outline-none shadow-md decoration-none"
              >
                <Phone className="w-4 h-4 text-white" />
                WhatsApp Direct Call
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onRequestQuote();
                }}
                className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-alpine-charcoal rounded-xl py-3 text-sm font-black shadow-md border-none cursor-pointer"
              >
                Request Custom Route
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
