import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { TravelPackage, Review } from './types';
import { INITIAL_PACKAGES } from './data/packages';
import { FLEET_OPTIONS } from './data/packages';

import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import PackageModal from './components/PackageModal';
import TripBuilder from './components/TripBuilder';
import SecurityCheck from './components/SecurityCheck';
import { Footer } from './components/Footer';
import FAQSection from './components/FAQSection';
import LazyImage from './components/LazyImage';

import { 
  Compass, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  ChevronRight, 
  PhoneCall, 
  Info,
  Star,
  ExternalLink,
  X,
  Upload,
  Image as ImageIcon,
  FileImage
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [allPackages] = useState<TravelPackage[]>(INITIAL_PACKAGES);
  const [selectedPkg, setSelectedPkg] = useState<TravelPackage | null>(null);

  // Reviews State
  const [allReviews, setAllReviews] = useState<Review[]>([
    {
      reviewId: 'rev-real-1',
      userId: 'uid-real-1',
      username: 'vasudevan_koneti',
      fullName: 'Vasudevan Koneti',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      rating: 5,
      message: 'I had a great time with this team. They taken care personally and always helpful at any time. From the day one from Dehradun to Badrinath, picked me from airport, arranged for accomodation, food, transport, came along with me for darshan and showed all the places by explaining the place history. They clicked all the photos of mine and shares through whatsapp. Really thankful to Tarun Sharma and Vini for making my visit memorable.',
      createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
    },
    {
      reviewId: 'rev-real-2',
      userId: 'uid-real-2',
      username: 'vikrant_parihar',
      fullName: 'Vikrant Parihar',
      photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80',
      rating: 5,
      message: 'Sharing this for Tarun Bhai — one of the finest people you’ll come across in the travel world. He’s been in this line for more than 20 years, and honestly, it shows. The kind of knowledge he has about Himachal, Kashmir, and Uttarakhand is next level. I think he’s been on almost every major trek in these regions himself, so when he gives suggestions, it’s from real experience — not just from Google. Along with him, Aanand Bhai handles the hospitality side perfectly — soft-spoken, professional, and always making sure travelers get the best stay and service. And then there’s Devinder Bhai, the transport expert — you just name a cab or route, and he’ll arrange it in minutes. Together, they make Alpine Goat feel less like a company and more like a group of locals who truly care about giving you the best Himalayan experience. Highly recommended whether you’re planning your first trip or your tenth!',
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
      reviewId: 'rev-real-3',
      userId: 'uid-real-3',
      username: 'sarath_kumar',
      fullName: 'sarath kumar',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      rating: 5,
      message: 'I recently did the Panch Kedar Yatra with Alpine Goat Adventure, and honestly, it was one of the best experiences of my life! Everything was so well organized — from travel and stay to food and guidance along the way.We were a group of 3 from Kerala which became 5 in Chandigarh after we met the Alpine team. The team was super supportive, friendly, and always ready to help, which made the whole journey smooth and enjoyable. It was our second Himalayan experience with the team after Manimahesh Kailash. The places we visited were absolutely breathtaking, and the spiritual energy at each Kedar was beyond words. I felt truly blessed to be part of this yatra, and I’m really thankful to Alpine Goat Adventure team, specially Tarun bhai, for making it such a memorable trip. We are planning for Shrikhand Kailash yatra next year with them. If you’re planning to go for any Himalayan treks, I’d highly recommend going with them — you’ll be in safe hands and have an amazing experience!',
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    },
    {
      reviewId: 'rev-real-4',
      userId: 'uid-real-4',
      username: 'dharmasiddhi_desai',
      fullName: 'dharmasiddhi desai',
      photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
      rating: 5,
      message: 'Excellent service at very odd place , where you can’t imagine anything , Mr . Tarun Sharma is there at your service , with his cool nature , talk less work more , with Excellent Home stays with excellent views & home made foods at place like shrikhand kailash , Kinner Kailash , yulla kanda etc we Enjoyed lot & his team always Supports us for reach our goals in tracking , thank you Tarun ji for Your support , koi Dikkat nahi hai ji 😊😊😊😊🙏 & There',
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
    }
  ]);



  // Quick Callback Form States
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickRoute, setQuickRoute] = useState('Spiti Valley');
  const [quickMonth, setQuickMonth] = useState('');
  const [quickNotes, setQuickNotes] = useState('');

  // Policy Modal Overlays
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [isBespokeModalOpen, setIsBespokeModalOpen] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);

  // Security Check System
  const [securityCheckOpen, setSecurityCheckOpen] = useState(false);
  const [securitySuccessCallback, setSecuritySuccessCallback] = useState<(() => void) | null>(null);

  const isHomeSection = ['hero', 'expeditions', 'services', 'fleet', 'custom-trip', 'safety', 'stories', 'contact'].includes(activeSection);

  // Smooth scroll handler on activeSection changes
  useEffect(() => {
    if (isHomeSection) {
      const targetId = activeSection === 'hero' ? 'section-hero' : `section-${activeSection}`;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [activeSection, isHomeSection]);

  // Dynamic Browser Title Updater based on section scroll intersection
  useEffect(() => {
    const titles: Record<string, string> = {
      'section-hero': "Alpine Goat Adventure • Let's Plan Your Perfect Adventure",
      'section-brand-story': "Alpine Goat Adventure • Our Heritage & Mountain Story",
      'section-expeditions': "Alpine Goat Adventure • Himalayan Expeditions & Private Safaris",
      'section-services': "Alpine Goat Adventure • Bespoke Overland Experiences",
      'section-fleet': "Alpine Goat Adventure • Elite 4x4 Expedition Vehicle Fleet",
      'section-safety': "Alpine Goat Adventure • High-Altitude Medical Safety Protocols",
      'section-stories': "Alpine Goat Adventure • Traveler Testimonials & Stories",
      'section-contact': "Alpine Goat Adventure • Design Your Custom Itinerary",
      'section-faq': "Alpine Goat Adventure • Mountain Acclimatization & Inner Line Permit FAQ"
    };

    const sectionIds = Object.keys(titles);
    let activeObserver: IntersectionObserver | null = null;

    const setupObserver = () => {
      const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (sections.length === 0) return;

      activeObserver = new IntersectionObserver((entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry && titles[bestEntry.target.id]) {
          document.title = titles[bestEntry.target.id];
        }
      }, {
        root: null,
        rootMargin: "-20% 0px -40% 0px", // focus on middle-upper viewport segment
        threshold: [0.0, 0.1, 0.2, 0.4, 0.6]
      });

      sections.forEach(sec => activeObserver?.observe(sec));
    };

    // Run setup immediately and on a slight delay to ensure dynamic elements have mounted fully
    setupObserver();
    const timer = setTimeout(setupObserver, 1000);

    return () => {
      clearTimeout(timer);
      if (activeObserver) {
        activeObserver.disconnect();
      }
    };
  }, [isHomeSection]);

  const handleSetSection = (sec: string) => {
    if (sec === 'custom-trip') {
      setIsBespokeModalOpen(true);
      return;
    }
    if (!isHomeSection) {
      setActiveSection('hero');
    }
    setActiveSection(sec);
    
    setTimeout(() => {
      const targetId = sec === 'hero' ? 'section-hero' : `section-${sec}`;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleQuickContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) {
      alert("Please provide both your Name and Phone Number to request a callback.");
      return;
    }

    const textMsg = encodeURIComponent(
      `*ALPINE GOAT ADVENTURE - CALLBACK REQUEST*\n\n` +
      `Hello! I would like to request a callback regarding a mountain expedition:\n\n` +
      `*Traveler Name:* ${quickName}\n` +
      `*Phone Number:* ${quickPhone}\n` +
      `*Route Interest:* ${quickRoute}\n` +
      `*Departure Target:* ${quickMonth || 'Flexible'}\n` +
      `*Traveler Notes:* ${quickNotes || 'None'}\n\n` +
      `Please connect me with a senior advisor. Thank you!`
    );
    const waUrl = `https://wa.me/918894699271?text=${textMsg}`;
    window.open(waUrl, '_blank');
  };

  const triggerSecurityCheck = (onSuccess: () => void) => {
    setSecuritySuccessCallback(() => onSuccess);
    setSecurityCheckOpen(true);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen text-alpine-charcoal bg-alpine-cream relative selection:bg-alpine-burgundy/10">
      
      {/* Scroll indicator bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-alpine-burgundy origin-[0%] z-50" style={{ scaleX }} />

      {/* 3D WebGL Himalayan Mountain Valley Ambient Experience */}
      <ThreeBackground />

      {/* Security Check Safeguard */}
      <SecurityCheck
        isOpen={securityCheckOpen}
        onVerify={() => {
          setSecurityCheckOpen(false);
          if (securitySuccessCallback) securitySuccessCallback();
        }}
        onCancel={() => {
          setSecurityCheckOpen(false);
          setSecuritySuccessCallback(null);
        }}
      />

      {/* Navigation Fixed Header */}
      <Navbar
        onSetSection={handleSetSection}
        onRequestQuote={() => handleSetSection('custom-trip')}
      />

      <main className="pt-24 pb-20 relative z-10">

          {isHomeSection && (
          <div className="space-y-32 animate-fadeIn pt-4">
            
            {/* Hero Header Area with Mountain Pictures Slideshow */}
            <div ref={heroRef} id="section-hero" className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-lg border border-alpine-burgundy/10 min-h-[72vh] flex flex-col justify-center items-center py-16 px-6 md:px-12 relative select-none scroll-mt-24">
                {/* Background mountain landscape with high-performance static rendering and blur-up */}
                <div className="absolute inset-0 pointer-events-none">
                  <LazyImage 
                    src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1920&q=82"
                    alt="Majestic Himalayan Overland Road"
                    className="w-full h-full object-cover opacity-65 scale-102"
                  />
                </div>
              {/* Dark luxurious warm brand linear overlay to lift typography contrast completely */}
              <div className="absolute inset-0 bg-gradient-to-b from-alpine-charcoal/70 via-alpine-charcoal/60 to-alpine-charcoal/80 mix-blend-multiply" />
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 space-y-8 max-w-4xl text-center"
              >
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-black tracking-tight leading-tighter drop-shadow-lg leading-none">
                    Let's Plan Your Perfect Adventure. <br />
                    <span className="italic text-alpine-cream font-serif font-medium">Explore the Extraordinary.</span>
                  </h1>
                  <p className="text-xs md:text-sm text-slate-100 max-w-2xl mx-auto leading-relaxed font-semibold drop-shadow-md tracking-wide">
                    Curated expeditions, custom itineraries, premium fleet journeys, and safe adventure experiences across India — planned with comfort, clarity, and local expertise.
                  </p>
                </div>

                {/* Highly crafted premium animated action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 25px -5px rgba(124, 28, 28, 0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSetSection('expeditions')}
                    className="w-full sm:w-auto px-8 py-4 bg-alpine-burgundy hover:bg-alpine-burgundy-dark text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] border border-alpine-burgundy/20 shadow-lg cursor-pointer outline-none flex items-center justify-center gap-2 group border-none"
                  >
                    <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
                    Explore Expeditions
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3, bg: "rgba(255, 255, 255, 0.15)", boxShadow: "0 10px 20px -10px rgba(255, 255, 255, 0.1)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSetSection('custom-trip')}
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-md rounded-xl text-xs uppercase tracking-[0.2em] font-black shadow-md cursor-pointer outline-none flex items-center justify-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-alpine-cream" />
                    Build Custom Trip
                  </motion.button>
                </div>

                {/* Primary Highlights Row with premium glassmorphic styling */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-4xl w-full">
                  {[
                    { label: 'Himalayan Base Office', desc: 'Centrally located to assist with customized itineraries, safety prep, and local permissions.' },
                    { label: 'Premier 4x4 Fleet', desc: 'Custom-equipped Mahindra Thar and Toyota Cruiser fleets on direct standby.' },
                    { label: 'Local Mountain Guides', desc: 'Handpicked local climbers and tracking experts raising high-altitude standards.' }
                  ].map((hl, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-left space-y-1 shadow-sm">
                      <p className="text-sm font-bold text-alpine-cream font-serif m-0">{hl.label}</p>
                      <p className="text-xs text-slate-200 m-0 leading-relaxed font-semibold mt-1">{hl.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Brand Story Scroll Journey */}
            <div id="section-brand-story" className="max-w-6xl mx-auto px-6 py-20 bg-alpine-cream-light/30 border border-alpine-burgundy/5 rounded-3xl relative overflow-hidden select-none scroll-mt-24 text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-alpine-burgundy/5 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-accent/5 rounded-full filter blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-alpine-burgundy border-b-2 border-alpine-burgundy/20 pb-0.5">
                    Himalayan Chronicle
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif text-alpine-charcoal font-black tracking-tight leading-tight m-0">
                    A Legacy Written <br />
                    <span className="italic font-serif font-medium text-alpine-burgundy">In Cliff Tracks</span>
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold m-0">
                    Founded in Shimla, Alpine Goat Adventure was created to deliver authentic, highly safe overland expeditions. We reject standard tourist paths. Instead, we design deep valley crossings, high-altitude passes, and spiritual yatras guided by certified experts.
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold m-0">
                    We operate legally, and for specialized zones we take permission from authorities. Our tour experts will help you the whole tour — cooperate with them and follow what our guides say, as we have experts and we know what we do.
                  </p>
                </div>

                <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-alpine-burgundy/5">
                      <LazyImage 
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
                        alt="High Mountain peak" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6 bg-alpine-cream rounded-2xl border border-alpine-burgundy/5 text-center">
                      <p className="text-2xl font-serif font-bold text-alpine-burgundy m-0">20+ Years</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 m-0 mt-1">Local Terrain Mastery</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="p-6 bg-white rounded-2xl border border-alpine-burgundy/5 text-center">
                      <p className="text-2xl font-serif font-bold text-alpine-burgundy m-0">100%</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 m-0 mt-1">Safety Compliant Stays</p>
                    </div>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-alpine-burgundy/5">
                      <LazyImage 
                        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80" 
                        alt="Expedition base campsite" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Catalog Grid Section */}
            <div id="section-expeditions" className="max-w-6xl mx-auto px-6 space-y-12 scroll-mt-24">
              <div className="text-center space-y-3">
                <span className="text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-alpine-burgundy border-b-2 border-alpine-burgundy/25 pb-1 inline-block">
                  Curated Catalog
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-alpine-charcoal font-bold tracking-tight">Signature Himalayan Routes</h2>
                <p className="text-sm text-slate-500 max-w-xl mx-auto font-semibold leading-relaxed">
                  Select a private overland itinerary vetted for road clearance, physical comfort, high altitude compliance, and luxury lodge stays.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPackages.map((pkg) => (
                  <motion.div
                    key={pkg.packageId}
                    whileHover={{ y: -6, boxShadow: "0 15px 35px -10px rgba(124, 28, 28, 0.15)" }}
                    onClick={() => setSelectedPkg(pkg)}
                    className="bg-white border border-alpine-burgundy/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer hover:border-alpine-burgundy/30 transition-all text-left"
                  >
                    <div>
                      <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                        <LazyImage 
                          src={pkg.heroImage} 
                          alt={pkg.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4 bg-alpine-charcoal/80 backdrop-blur-xs text-[10px] font-mono uppercase tracking-wider text-white px-2.5 py-1 rounded-md font-bold">
                          100% Customized
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <p className="text-[9px] uppercase tracking-widest font-mono text-alpine-burgundy font-black m-0">{pkg.destination}</p>
                        <h3 className="text-xl font-serif text-alpine-charcoal font-bold leading-snug m-0">{pkg.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold m-0">{pkg.shortDescription}</p>
                      </div>
                    </div>

                    <div className="p-6 border-t border-alpine-cream flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold m-0">Starts From</p>
                        <p className="text-base font-mono font-bold text-alpine-burgundy m-0">₹{pkg.startingPrice.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-alpine-burgundy uppercase tracking-widest flex items-center gap-1">
                        View Itinerary <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Signature Base Services Section */}
            <div id="section-services" className="max-w-6xl mx-auto px-6 py-20 bg-alpine-cream-light/35 border border-alpine-burgundy/5 rounded-3xl select-none scroll-mt-24 text-left">
              <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-alpine-burgundy border-b-2 border-alpine-burgundy/25 pb-1">
                  Services Spectrum
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-alpine-charcoal tracking-tight">Our Support Capabilities</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto">
                  How our experienced coordinators and field crews optimize your security, permits, stays and mapping.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { title: "Permits & Clearances", desc: "Inner line permissions, specialized zone clearances, green tax processing, and local administration approvals handled fully by our team." },
                  { title: "Bespoke Route Planning", desc: "We design highly curated, high-altitude road itineraries tailored to seasonal clearances and physical comfort criteria." },
                  { title: "Premium SUV Fleets", desc: "Fully equipped luxury 4x4 vehicles, oxygen cylinders, backup drivers, and experienced mountain guides at your service." },
                  { title: "Double-Vetted Lodges", desc: "Handpicked premium wooden cottages, traditional homestays with hot water, and luxury glamping domes tested for altitude safety." }
                ].map((serv, idx) => (
                  <div key={idx} className="p-6 bg-white border border-alpine-burgundy/10 rounded-2xl space-y-4 shadow-sm text-left">
                    <div className="w-10 h-10 rounded-xl bg-alpine-burgundy/5 flex items-center justify-center text-alpine-burgundy font-mono font-extrabold text-sm">{idx + 1}</div>
                    <h3 className="text-base font-serif font-black text-alpine-charcoal m-0">{serv.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold m-0">{serv.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Fleet Presentation Section */}
            <div id="section-fleet" className="max-w-6xl mx-auto px-6 space-y-12 scroll-mt-24">
              <div className="text-center space-y-3">
                <span className="text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-alpine-burgundy border-b-2 border-alpine-burgundy/25 pb-1 inline-block">
                  Fleet Registry
                </span>
                <h2 className="text-3xl md:text-4xl font-serif text-alpine-charcoal font-bold tracking-tight">Caravan Cruiser Vehicle Fleet</h2>
                <p className="text-sm text-slate-500 max-w-xl mx-auto font-semibold leading-relaxed">
                  Inspect the structural specifications of our private mountain cruising fleet. Fully maintained and safety-checked before departure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FLEET_OPTIONS.map((flt) => (
                  <motion.div
                    key={flt.vehicleId}
                    whileHover={{ y: -4, border: '1px solid #7C1C1C' }}
                    className="bg-white border border-alpine-burgundy/10 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between text-left group transition-all"
                  >
                    <div>
                      <div className="aspect-video relative overflow-hidden">
                        <LazyImage 
                          src={flt.image} 
                          alt={flt.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                      <div className="p-6 space-y-2">
                        <h3 className="text-base font-serif text-alpine-charcoal font-bold group-hover:text-alpine-burgundy transition-colors m-0 leading-snug">{flt.name}</h3>
                        <p className="text-xs text-alpine-burgundy font-mono tracking-wider font-extrabold uppercase m-0">{flt.capacity}</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold m-0 mt-2">{flt.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Inline Safety & trust constellation */}
            <div id="section-safety" className="max-w-6xl mx-auto px-6 py-20 bg-alpine-charcoal text-white rounded-3xl relative overflow-hidden shadow-xl text-left select-none scroll-mt-24">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0.5px,transparent_0.5px)] bg-[length:16px_16px] opacity-40 pointer-events-none" />
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-alpine-burgundy/10 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gold-accent/10 rounded-full filter blur-3xl pointer-events-none" />

              <div className="text-center space-y-3 mb-16 relative z-10 max-w-2xl mx-auto">
                <span className="text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-gold-accent border-b-2 border-gold-accent/25 pb-1">
                  Travel Safety & Trust
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-white tracking-tight">Our Standards for Safe Journeys</h2>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed max-w-xl mx-auto">
                  Explore the key pillars of safety, legality, and local expertise that anchor every single journey with Alpine Goat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {[
                  { title: "Thousands of Guests", desc: "We focus on genuine, personalized hospitality for every traveler." },
                  { title: "Custom Tours", desc: "Successfully guided across Himachal, Kashmir, and Uttarakhand." },
                  { title: "100% Safety Focus", desc: "Equipped with backup drivers, direct office coordination, and emergency networks." },
                  { title: "Official Permissions", desc: "We operate legally and acquire required permits from authorities." },
                  { title: "Expert Local Guides", desc: "Our tour experts and guides are certified and know the terrain perfectly." },
                  { title: "Safe & Friendly Paths", desc: "Double-vetted stays, respectful staff, and absolute comfort for solo travelers." },
                  { title: "Reliable Vehicle Fleet", desc: "Thoroughly maintained 4x4 vehicles and expert mountain drivers at your service." },
                  { title: "Cozy Homestays & Food", desc: "Excellent homestays with breathtaking views of mountains and hygienic home-cooked meals." }
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    whileHover={{ scale: 1.03, rotate: 0.5, boxShadow: "0 8px 24px -6px rgba(197, 160, 89, 0.25)" }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-3 relative group transition-all"
                  >
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold-accent" />
                    
                    <span className="text-[10px] font-mono text-gold-accent block">PILLAR-0{i+1}</span>
                    <h3 className="text-base font-serif font-black text-alpine-cream leading-tight m-0">{node.title}</h3>
                    <p className="text-[11px] leading-relaxed font-semibold m-0 text-slate-300 mt-2">{node.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Guest Memories and Chronicles */}
            <div id="section-stories" className="max-w-4xl mx-auto px-6 space-y-10 scroll-mt-24">
              <div className="text-center space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alpine-burgundy border-b-2 border-alpine-burgundy/25 pb-1">
                  Guest Testimonials
                </span>
                <h2 className="text-4xl font-serif text-alpine-charcoal font-bold">Stories from High Border Passes</h2>
                <p className="text-sm text-slate-500 font-semibold select-none">
                  Real-time verified traveler ratings and feedback submitted by our passengers.
                </p>
              </div>



              {/* Reviews Feed Display */}
              <div className="space-y-6">
                {allReviews.map((rev) => (
                  <motion.div
                    key={rev.reviewId}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 bg-white border border-alpine-burgundy/10 rounded-2xl shadow-xs text-left space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Elegant text initials badge instead of reviewer photo */}
                        <div className="w-9 h-9 rounded-full bg-alpine-burgundy/5 border border-alpine-burgundy/10 flex items-center justify-center font-serif text-xs font-black text-alpine-burgundy">
                          {rev.fullName.charAt(0)}
                        </div>
                        <div className="leading-tight">
                          <p className="text-sm font-serif font-extrabold text-alpine-charcoal m-0">{rev.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-mono font-bold text-amber-700">{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-semibold m-0 font-sans italic">
                      "{rev.message}"
                    </p>

                    {rev.attachedImage && (
                      <div className="aspect-[16/9] max-h-48 rounded-xl overflow-hidden border border-slate-100 shadow-xs relative">
                        <LazyImage
                          src={rev.attachedImage}
                          alt="travel backdrop"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-alpine-charcoal/80 backdrop-blur-xs text-[9px] font-mono font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                          📷 Expedition Backdrop
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Logged on {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Verified Google Reviews Integration Section */}
              <div className="bg-slate-100/60 border border-alpine-burgundy/15 rounded-2xl p-6 text-left space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-extrabold uppercase rounded">Live</span>
                      <h4 className="text-sm font-serif font-black text-alpine-charcoal m-0">Verified Google Reviews Feed</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold m-0">
                      We hold a perfect <span className="text-alpine-burgundy font-black">5.0 Star Rating</span> on Google Maps. Read real stories directly from verified profiles.
                    </p>
                  </div>
                  <a 
                    href="https://share.google/OEasE607nMtbkY5dL"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-alpine-burgundy hover:bg-alpine-burgundy/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider outline-none shadow-sm transition-all cursor-pointer decoration-none"
                  >
                    Read more review on google
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Inline Contact Desk */}
            <div id="section-contact" className="max-w-4xl mx-auto px-6 py-12 text-left space-y-12 scroll-mt-24">
              <div className="text-center space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alpine-burgundy border-b-2 border-alpine-burgundy/25 pb-1">
                  Logistics Desk
                </span>
                <h2 className="text-4xl font-serif text-alpine-charcoal font-bold">Contact Our Base Office</h2>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  Reach out to our office directly for bookings, permissions assistance, or travel inquiries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="bg-white border border-alpine-burgundy/10 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                  <h3 className="text-lg font-serif text-alpine-charcoal font-extrabold pb-2 border-b border-alpine-burgundy/5 m-0">Headquarters Coordinates</h3>
                  
                  <div className="text-xs text-slate-600 space-y-3.5 leading-relaxed font-semibold">
                    <p className="m-0"><span className="text-alpine-burgundy font-extrabold uppercase text-[10px] tracking-wider block">Address:</span> Shanti Niwas, village Badhai Sankatmochan, Post Office Bagh, Taradevi, Shimla, Himachal Pradesh 171010</p>
                    <p className="m-0"><span className="text-alpine-burgundy font-extrabold uppercase text-[10px] tracking-wider block">Coordinates:</span> 31.0831° N, 77.1443° E</p>
                    <p className="m-0"><span className="text-alpine-burgundy font-extrabold uppercase text-[10px] tracking-wider block">Logistics Phone:</span> 088946 99271</p>
                    <p className="m-0"><span className="text-alpine-burgundy font-extrabold uppercase text-[10px] tracking-wider block">Direct Desk:</span> alpinegoatadventure@gmail.com</p>
                  </div>
                </div>

                <div className="bg-white border border-alpine-burgundy/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif text-alpine-charcoal font-extrabold pb-2 border-b border-alpine-burgundy/5 m-0">Request Direct Call Back</h3>
                    <p className="text-[11px] text-slate-500 leading-normal font-sans">Fill out this quick form. We immediately format your query and connect you over WhatsApp to organize authorizations.</p>
                  </div>

                  <form onSubmit={handleQuickContactSubmit} className="space-y-3 pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="quick-name" className="sr-only">Full Name</label>
                        <input
                          id="quick-name"
                          type="text"
                          required
                          placeholder="Your Name *"
                          value={quickName}
                          onChange={e => setQuickName(e.target.value)}
                          className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-lg px-3 py-2 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy"
                        />
                      </div>
                      <div>
                        <label htmlFor="quick-phone" className="sr-only">Phone Number</label>
                        <input
                          id="quick-phone"
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          value={quickPhone}
                          onChange={e => setQuickPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-lg px-3 py-2 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="quick-route-select" className="sr-only">Route Interest</label>
                        <select
                          id="quick-route-select"
                          value={quickRoute}
                          onChange={e => setQuickRoute(e.target.value)}
                          className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-lg px-3 py-2 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy"
                        >
                          <option value="Spiti Valley">Spiti Overland</option>
                          <option value="Kashmir Great Lakes">Kashmir Lakes</option>
                          <option value="Meghalaya Clouds">Meghalaya</option>
                          <option value="Royal Rajasthan">Royal Rajasthan</option>
                          <option value="Manali Lahaul">Manali Lahaul</option>
                          <option value="Kerala Backwaters">Kerala</option>
                          <option value="Custom Trek">Custom Trek</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="quick-month" className="sr-only">Departure Month</label>
                        <input
                          id="quick-month"
                          type="text"
                          placeholder="Month (e.g. Oct 2026)"
                          value={quickMonth}
                          onChange={e => setQuickMonth(e.target.value)}
                          className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-lg px-3 py-2 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quick-notes" className="sr-only">Additional logistics notes</label>
                      <textarea
                        id="quick-notes"
                        rows={1}
                        placeholder="Logistics notes or preferences (optional)..."
                        value={quickNotes}
                        onChange={e => setQuickNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-lg px-3 py-2 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow transition-transform hover:scale-[1.01] border-none cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      Request WhatsApp Callback
                    </button>
                  </form>
                </div>
              </div>

              {/* Collapsible FAQ Section */}
              <div id="section-faq" className="scroll-mt-24">
                <FAQSection />
              </div>

              {/* Campfire Final Cinematic CTA Block */}
              <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-alpine-burgundy/10 relative select-none">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-alpine-charcoal/95 via-alpine-charcoal/80 to-alpine-charcoal/40 mix-blend-multiply" />
                
                <div className="relative z-10 p-10 md:p-16 text-center space-y-6">
                  <span className="text-[11px] font-mono font-extrabold uppercase tracking-[0.4em] text-gold-accent">
                    PREMIUM OVERLAND JOURNEYS
                  </span>
                  <h3 className="text-3xl md:text-5xl font-serif text-white font-bold leading-tight">
                    The Mountains Are Calling. <br />
                    <span className="italic font-serif font-medium text-alpine-cream text-2xl md:text-4xl">What Is Your Route?</span>
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed font-semibold">
                    We operate legally, and for specialized zones we take permission from authorities. Our tour experts will help you the whole tour — cooperate with them and follow what our guides say, as we have experts and we know what we do.
                  </p>
                  
                  <div className="pt-4 flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => handleSetSection('custom-trip')}
                      className="px-6 py-3.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-alpine-charcoal font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer outline-none border-none"
                    >
                      Plan Your Itinerary
                    </button>
                    <a
                      href="tel:+918894699271"
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg border border-white/25 shadow-sm transition-all flex items-center gap-2 decoration-none"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-alpine-cream" />
                      Phone Hotline
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}



      </main>

      <Footer
        onSetSection={handleSetSection}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenCookie={() => setShowCookieModal(true)}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenDisclaimer={() => setShowDisclaimerModal(true)}
      />

      {/* Interactive Policy Modal Overlays */}
      <AnimatePresence>
        {/* 1. PRIVACY POLICY */}
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-alpine-charcoal/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-white border border-alpine-burgundy/10 relative text-left shadow-2xl space-y-6"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-alpine-burgundy" />
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-alpine-charcoal bg-white shadow-xs outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-alpine-burgundy font-bold">Regulatory Compliance</span>
                <h3 className="text-2xl font-serif text-alpine-charcoal font-black">Privacy Policy & IP Rights</h3>
              </div>

              <div className="text-xs text-slate-600 space-y-4 leading-relaxed font-semibold font-sans">
                <p><strong>Passenger Data Sovereignty:</strong> Alpine Goat Adventure Private Limited values your personal data privacy under applicable global guidelines and the Information Technology Act of India. We collect your Name, WhatsApp contact parameters, and custom trip preferences purely to negotiate official inner-line clearances, route permits, and transport allocations with local officials in Shimla and specialized border authorities.</p>
                <p><strong>Zero Marketing Leaks:</strong> All information is processed strictly within secured servers and is never shared, sold, licensed, or forwarded to unvetted marketing networks or promotional agencies. We coordinate fully with regional administration and statutory agencies during extreme weather evacuations to guarantee passenger safety.</p>
                <p className="p-3 bg-red-50 text-alpine-burgundy rounded-xl border border-alpine-burgundy/10">
                  <strong>Copyright & DMCA Notice:</strong> We highly respect intellectual property rights. If you believe any photographic assets, text excerpts, logos, or graphic resources featured on this website infringe upon your personal or organizational copyrights, please contact us immediately at <strong>alpinegoatadventure@gmail.com</strong>. Upon receiving your email with active ownership credentials, we will take immediate corrective action, including prompt removal or formal attribution of the disputed files within 24 to 48 hours.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. COOKIE POLICY */}
        {showCookieModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-alpine-charcoal/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-white border border-alpine-burgundy/10 relative text-left shadow-2xl space-y-6"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-alpine-burgundy" />
              <button 
                onClick={() => setShowCookieModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-alpine-charcoal bg-white shadow-xs outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-alpine-burgundy font-bold">Cookie Protocols</span>
                <h3 className="text-2xl font-serif text-alpine-charcoal font-black">Cookies & Tracker Standards</h3>
              </div>

              <div className="text-xs text-slate-600 space-y-4 leading-relaxed font-semibold font-sans">
                <p><strong>Essential Session Parameters:</strong> Our web platform utilizes strictly essential client-side storage states to preserve your customized travel builder wizard inputs and user preferences.</p>
                <p>No intrusive third-party trackers, retargeting beacons, or behavioral monitoring cookies are utilized. Your browser session remains completely private, secure, and lightning-fast.</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* 3. TERMS OF CARRIAGE */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-alpine-charcoal/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-white border border-alpine-burgundy/10 relative text-left shadow-2xl space-y-6"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-alpine-burgundy" />
              <button 
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-alpine-charcoal bg-white shadow-xs outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-alpine-burgundy font-bold">Terms of carriage</span>
                <h3 className="text-2xl font-serif text-alpine-charcoal font-black">Terms & Carriage Conditions</h3>
              </div>

              <div className="text-xs text-slate-600 space-y-4 leading-relaxed font-semibold font-sans">
                <p><strong>Guide & Expert Directives:</strong> By scheduling and booking overland coordinates with Alpine Goat Adventure, all travelers agree to cooperate fully and follow instructions provided by our certified guides and mountain tour experts. Mountain environments feature volatile and rapid climate variations. Guide decisions regarding high-altitude adjustments, route diversions, or emergency descents are final and binding for passenger safety.</p>
                <p><strong>Administrative Permissions:</strong> We operate strictly in a legal manner. For all restricted, protected, or military zones (such as Spiti, Lahaul, and border passes), we secure required permits from designated local civil and army authorities. Passengers are required to provide authentic identification as requested for these administrative clearances.</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* 4. ALPINE RISK DISCLAIMER */}
        {showDisclaimerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-alpine-charcoal/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-white border border-alpine-burgundy/10 relative text-left shadow-2xl space-y-6"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-alpine-burgundy" />
              <button 
                onClick={() => setShowDisclaimerModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-alpine-charcoal bg-white shadow-xs outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-alpine-burgundy font-bold">Alpine Risk disclosure</span>
                <h3 className="text-2xl font-serif text-alpine-charcoal font-black">Limitation of Liability & Disclaimer</h3>
              </div>

              <div className="text-xs text-slate-600 space-y-4 leading-relaxed font-semibold font-sans">
                <p className="font-bold text-alpine-charcoal">PLEASE READ THIS CAREFULLY. BY ENTERING THE SITE AND booking AN EXPEDITION, YOU AGREE TO THESE TERMS.</p>
                <p><strong>High Altitude Intrinsic Hazards:</strong> Our expeditions traverse challenging off-road routes reaching extreme elevations exceeding 10,000 feet. All participants with historical medical backgrounds of high blood pressure, respiratory issues, cardiac history, or severe altitude sickness must disclose these parameters prior to expedition launch.</p>
                <p><strong>Limitation of Liability:</strong> Under no circumstances shall Alpine Goat Adventure, its founders, travel managers, field guides, operators, or vehicle suppliers be held liable for any direct, indirect, incidental, punitive, or consequential damages resulting from high-altitude exploration, unexpected road blockages, natural rockslides, military closures, or sudden regional permit cancellations. We coordinate legally to secure alternative pathways, but mountain safety remains paramount.</p>
                <p><strong>"As-Is" Platform Warranty:</strong> All digital maps, pricing estimates, itinerary listings, and information on this platform are served on an "as-is" and "as-available" baseline. For any legal inquiries, intellectual property disputes, or copyright issues, please submit coordinates directly to our administrative desk at <strong>alpinegoatadventure@gmail.com</strong> and we will resolve it immediately in good faith.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Package Detail Modal Overlay popup */}
      {selectedPkg && (
        <PackageModal
          isOpen={!!selectedPkg}
          onClose={() => setSelectedPkg(null)}
          pkg={selectedPkg}
          triggerSecurityCheck={triggerSecurityCheck}
        />
      )}

      {/* Bespoke Custom Trip Planner Modal */}
      <TripBuilder
        isOpen={isBespokeModalOpen}
        onClose={() => setIsBespokeModalOpen(false)}
        triggerSecurityCheck={triggerSecurityCheck}
      />

    </div>
  );
}
