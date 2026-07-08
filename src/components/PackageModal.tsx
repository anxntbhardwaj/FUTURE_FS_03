import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Info, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TravelPackage, UserProfile } from '../types';
import LazyImage from './LazyImage';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: TravelPackage;
  profile?: UserProfile | null;
  triggerSecurityCheck?: (onVerifySuccess: () => void) => void;
}

export default function PackageModal({ isOpen, onClose, pkg, profile, triggerSecurityCheck }: PackageModalProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'highlights' | 'inclusions' | 'quote'>('itinerary');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    selectedDate: '',
    travelDuration: '',
    guests: 2,
    notes: '',
    budgetType: 'Per Person',
    budgetAmount: '20000',
    budgetRange: '₹20,000 – ₹35,000',
  });
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInquiryId, setCreatedInquiryId] = useState('');

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  // High-precision timeline road and car alignment metrics
  const [bulletYPositions, setBulletYPositions] = useState<number[]>([]);
  const [totalScrollHeight, setTotalScrollHeight] = useState<number>(350);
  const itineraryContainerRef = useRef<HTMLDivElement>(null);
  const itineraryItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Smooth scroll car coordinates
  const [carScrollY, setCarScrollY] = useState(22);
  const [carScrollX, setCarScrollX] = useState(14);
  const [carAngle, setCarAngle] = useState(90);
  const carRef = useRef<HTMLDivElement>(null);
  const roadPathRef = useRef<SVGPathElement>(null);

  const animationProgressRef = useRef(0);
  const animationDirectionRef = useRef(1); // 1 = down, -1 = up
  const lastTimeRef = useRef<number | null>(null);

  const bulletPositionsRef = useRef<number[]>([]);
  const activeDayIndexRef = useRef(0);

  useEffect(() => {
    bulletPositionsRef.current = bulletYPositions;
  }, [bulletYPositions]);

  useEffect(() => {
    activeDayIndexRef.current = activeDayIndex;
  }, [activeDayIndex]);

  const updateBulletPositions = () => {
    const items = itineraryItemRefs.current;
    const container = itineraryContainerRef.current;
    if (!container || !items.length) return;

    const positions = pkg.itinerary.map((_, idx) => {
      const el = items[idx];
      if (!el) return (idx * 90) + 22;
      return el.offsetTop + 22;
    });

    setBulletYPositions(positions);
    setTotalScrollHeight(container.scrollHeight || 350);
  };

  const getCoordsForProgress = (progress: number) => {
    const total = pkg.itinerary.length;
    if (total <= 1) return { x: 14, y: 22, angle: 90 };

    const pathEl = roadPathRef.current;
    if (pathEl) {
      try {
        const totalLength = pathEl.getTotalLength();
        if (totalLength > 0) {
          const distance = progress * totalLength;
          const point = pathEl.getPointAtLength(distance);
          
          const step = 2; // px
          const dir = animationDirectionRef.current;
          const nextDistance = dir === 1
            ? Math.min(totalLength, distance + step)
            : Math.max(0, distance - step);
          const p1 = point;
          const p2 = pathEl.getPointAtLength(nextDistance);
          
          let angle = 90;
          if (p2 && p1 && (p2.x !== p1.x || p2.y !== p1.y)) {
            const dx = dir === 1 ? (p2.x - p1.x) : (p1.x - p2.x);
            const dy = dir === 1 ? (p2.y - p1.y) : (p1.y - p2.y);
            angle = Math.atan2(dy, dx) * 180 / Math.PI;
          }
          return { x: point.x, y: point.y, angle };
        }
      } catch (err) {
        console.error("Error calling getPointAtLength", err);
      }
    }

    // Fallback if SVG path not yet measured
    const segmentIndex = Math.min(total - 2, Math.floor(progress * (total - 1)));
    const fraction = (progress * (total - 1)) - segmentIndex;

    const padding = 22;
    const roadHeight = totalScrollHeight - (padding * 2);

    const y1 = bulletPositionsRef.current[segmentIndex] !== undefined ? bulletPositionsRef.current[segmentIndex] : (segmentIndex / (total - 1)) * roadHeight + padding;
    const y2 = bulletPositionsRef.current[segmentIndex + 1] !== undefined ? bulletPositionsRef.current[segmentIndex + 1] : ((segmentIndex + 1) / (total - 1)) * roadHeight + padding;

    const x1 = segmentIndex % 2 === 0 ? 14 : 34;
    const x2 = (segmentIndex + 1) % 2 === 0 ? 14 : 34;

    const smoothFraction = (1 - Math.cos(fraction * Math.PI)) / 2; // Cosine smoothing
    const targetX = x1 + (x2 - x1) * smoothFraction;
    const targetY = y1 + (y2 - y1) * fraction;

    const nextFraction = Math.min(1, fraction + 0.05);
    const nextY = y1 + (y2 - y1) * nextFraction;
    const nextSmoothFraction = (1 - Math.cos(nextFraction * Math.PI)) / 2;
    const nextX = x1 + (x2 - x1) * nextSmoothFraction;

    const dir = animationDirectionRef.current;
    const dx = dir === 1 ? (nextX - targetX) : (targetX - nextX);
    const dy = dir === 1 ? (nextY - targetY) : (targetY - nextY);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    return { x: targetX, y: targetY, angle };
  };

  // Run measuring logic whenever open status, active tab or route length changes
  useEffect(() => {
    if (isOpen && activeTab === 'itinerary') {
      const timer = setTimeout(updateBulletPositions, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab, pkg.itinerary.length]);

  // Reset tab and active index on open, and start driving animation
  useEffect(() => {
    if (isOpen) {
      setActiveTab('itinerary');
      setActiveDayIndex(0);
      setIsAutoplayActive(true);
      animationProgressRef.current = 0;
      animationDirectionRef.current = 1;
      lastTimeRef.current = null;
    }
  }, [isOpen]);

  // High performance automatic drive animation loop using requestAnimationFrame
  useEffect(() => {
    if (!isOpen || activeTab !== 'itinerary') {
      lastTimeRef.current = null;
      return;
    }

    let rafId: number;

    const tick = () => {
      const now = performance.now();
      if (lastTimeRef.current !== null) {
        const dt = (now - lastTimeRef.current) / 1000; // seconds
        
        if (isAutoplayActive) {
          // Exactly 7 seconds to complete the itinerary one way
          let nextProgress = animationProgressRef.current + animationDirectionRef.current * (dt / 7);
          
          if (nextProgress >= 1) {
            nextProgress = 1;
            animationDirectionRef.current = -1; // Turn around, go back up
          } else if (nextProgress <= 0) {
            nextProgress = 0;
            animationDirectionRef.current = 1; // Turn around, go back down
          }
          
          animationProgressRef.current = nextProgress;
          
          const coords = getCoordsForProgress(nextProgress);
          setCarScrollX(coords.x);
          setCarScrollY(coords.y);
          setCarAngle(coords.angle);

          // Find the closest bullet position and highlight it
          const total = pkg.itinerary.length;
          const bulletPositions = bulletPositionsRef.current;
          if (total > 1 && bulletPositions.length === total) {
            let closestIndex = 0;
            let minDiff = Infinity;
            for (let i = 0; i < total; i++) {
              const diff = Math.abs(coords.y - bulletPositions[i]);
              if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
              }
            }
            
            if (activeDayIndexRef.current !== closestIndex) {
              setActiveDayIndex(closestIndex);
              
              // Autoscroll list to focus active card
              const container = itineraryContainerRef.current;
              const activeItem = itineraryItemRefs.current[closestIndex];
              if (container && activeItem) {
                const itemTop = activeItem.offsetTop;
                const itemHeight = activeItem.clientHeight;
                const containerHeight = container.clientHeight;
                const targetScroll = itemTop - (containerHeight / 2) + (itemHeight / 2);
                container.scrollTo({
                  top: targetScroll,
                  behavior: 'smooth'
                });
              }
            }
          }
        }
      }
      lastTimeRef.current = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isOpen, activeTab, isAutoplayActive, pkg.itinerary.length]);

  const getCurvyPath = () => {
    const total = pkg.itinerary.length;
    if (total <= 1) return '';
    let path = '';
    const hasMeasured = bulletYPositions && bulletYPositions.length === total;

    for (let i = 0; i < total; i++) {
      let y = 0;
      if (hasMeasured) {
        y = bulletYPositions[i];
      } else {
        y = (i / (total - 1)) * 90 + 5;
      }
      const x = i % 2 === 0 ? 14 : 34;
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        let prevY = 0;
        if (hasMeasured) {
          prevY = bulletYPositions[i - 1];
        } else {
          prevY = ((i - 1) / (total - 1)) * 90 + 5;
        }
        const prevX = (i - 1) % 2 === 0 ? 14 : 34;
        const cpY1 = prevY + (y - prevY) / 3;
        const cpY2 = prevY + (2 * (y - prevY)) / 3;
        path += ` C ${prevX} ${cpY1}, ${x} ${cpY2}, ${x} ${y}`;
      }
    }
    
    // If we're using percents, return SVG-native coordinates, otherwise pixels
    return path;
  };

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.fullName || `${profile.firstName} ${profile.lastName}`.trim(),
        phoneNumber: profile.phoneNumber || '',
      }));
    }
  }, [profile, isOpen]);



  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert("Please provide your Name to continue.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      alert("Please provide your Phone Number so we can connect back.");
      return;
    }

    setSubmitting(true);
    const inquiryId = `inq-${Date.now()}`;
    setCreatedInquiryId(inquiryId);

    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
      
      // Auto open WhatsApp formatted message
      const link = formattedWhatsAppUrl(inquiryId);
      window.open(link, '_blank');
    }, 1000);
  };

  const formattedWhatsAppUrl = (inqId?: string) => {
    const currentInquiryId = inqId || createdInquiryId || `inq-${Date.now()}`;
    const textMsg = encodeURIComponent(
      `*ALPINE GOAT ADVENTURES - TOUR INQUIRY*\n\n` +
      `Hello! I would like to request a quote for the *"${pkg.title}"* expedition.\n\n` +
      `*Traveler Name:* ${formData.fullName}\n` +
      `*Phone Number:* ${formData.phoneNumber}\n` +
      `*Expedition:* ${pkg.title}\n` +
      `*Destination:* ${pkg.destination}\n` +
      `*Preferred Route Date:* ${formData.selectedDate}\n` +
      `*Duration of Travel:* ${formData.travelDuration}\n` +
      `*Group Members:* ${formData.guests} Travelers\n` +
      `*Budget Type:* ${formData.budgetType}\n` +
      `*Approx Budget:* ${formData.budgetAmount}\n` +
      `*Custom Requirements:* ${formData.notes || 'None'}\n\n` +
      `*Inquiry ID:* ${currentInquiryId}\n\n` +
      `Please contact me back with available slots and estimated quotation. Thank you!`
    );
    return `https://wa.me/918894699271?text=${textMsg}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-alpine-charcoal/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-5xl h-[85vh] lg:h-[75vh] grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-white relative shadow-2xl border border-alpine-burgundy/10"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-alpine-burgundy" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center bg-white border border-alpine-burgundy/15 text-alpine-burgundy hover:bg-alpine-cream shadow outline-none cursor-pointer"
          >
            <X className="w-5 h-5 text-current" />
          </button>

          {/* Left Column: Cinematic Visual Panel */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-8 overflow-y-auto border-r border-alpine-burgundy/10 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(244,244,240,0.92), rgba(244,244,240,0.97)), url(${pkg.heroImage})` }}>
            <div className="space-y-4 text-left">
              <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-alpine-burgundy font-black m-0">The Alpine Catalog</p>
              <h2 className="text-3xl font-serif text-alpine-charcoal font-black leading-tight m-0">{pkg.title}</h2>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed m-0">{pkg.shortDescription}</p>
              
              <div className="pt-4 border-t border-alpine-burgundy/5 space-y-2">
                <p className="text-xs text-slate-600 font-bold"><span className="text-alpine-burgundy uppercase text-[9px] font-mono tracking-wider block">Duration:</span> {pkg.duration}</p>
                <p className="text-xs text-slate-600 font-bold"><span className="text-alpine-burgundy uppercase text-[9px] font-mono tracking-wider block">Starting coordinates:</span> {pkg.destination}</p>
                <p className="text-xs text-slate-600 font-bold"><span className="text-gold-accent uppercase text-[9px] font-mono tracking-wider block">Estimated Starts:</span> ₹{pkg.startingPrice.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => setActiveTab('quote')}
                className="w-full py-3.5 px-4 bg-alpine-burgundy hover:bg-alpine-burgundy-dark text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer outline-none shadow-md hover:scale-[1.01]"
              >
                <Compass className="w-4 h-4" />
                Request Custom Quote
              </button>
            </div>
          </div>

          {/* Right Column: Tabbed Information and Forms */}
          <div className="col-span-1 lg:col-span-7 flex flex-col h-full bg-slate-50/30 overflow-y-auto">
            {/* Nav tabs - beautifully spaced */}
            <div className="flex border-b border-alpine-burgundy/5 bg-alpine-cream-light/40 sticky top-0 z-10 pr-14 lg:pr-0">
              {(['itinerary', 'highlights', 'inclusions', 'quote'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-[10px] sm:text-xs font-mono uppercase tracking-wider font-extrabold border-b-2 transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'border-alpine-burgundy text-alpine-burgundy bg-white'
                      : 'border-transparent text-slate-400 hover:text-alpine-charcoal hover:bg-white/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content panel */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {isSuccess ? (
                  <div className="text-center py-12 space-y-6 flex flex-col items-center justify-center animate-fadeIn text-left">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center text-emerald-600">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-alpine-charcoal font-black">Quote Proposal Compiled!</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold max-w-md mx-auto">
                        Your custom preferences for <strong>{pkg.title}</strong> has been prepared. Ref Code: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-alpine-burgundy font-bold">{createdInquiryId}</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm pt-4">
                      <a
                        href={formattedWhatsAppUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-md cursor-pointer decoration-none"
                      >
                        Send Quote on WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          setActiveTab('itinerary');
                        }}
                        className="w-full py-2.5 border border-alpine-burgundy/10 hover:bg-alpine-cream-light text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        View Itinerary Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {activeTab === 'itinerary' && (
                      <div className="space-y-4 text-left">
                        <h3 className="text-lg font-serif text-alpine-charcoal font-black pb-2 border-b border-alpine-burgundy/5">Day-by-Day Expedition Itinerary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div 
                            ref={itineraryContainerRef} 
                            className="md:col-span-7 relative pl-18 max-h-[350px] overflow-y-auto pr-1 scroll-smooth"
                          >
                            {/* The Curvy Mountain Road Vector Track */}
                            <div className="absolute left-[16px] top-0 bottom-0 w-12 z-0 pointer-events-none" style={{ height: `${totalScrollHeight}px` }}>
                              <svg className="w-full h-full overflow-visible" viewBox={`0 0 48 ${totalScrollHeight}`} preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#334155" />
                                    <stop offset="100%" stopColor="#1e293b" />
                                  </linearGradient>
                                  <linearGradient id="mountainGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.12" />
                                    <stop offset="100%" stopColor="#1e293b" stopOpacity="0.01" />
                                  </linearGradient>
                                  <linearGradient id="mountainGradMid" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#c5a880" stopOpacity="0.12" />
                                    <stop offset="100%" stopColor="#c5a880" stopOpacity="0.01" />
                                  </linearGradient>
                                  <linearGradient id="mountainGradNear" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#7a1c31" stopOpacity="0.14" />
                                    <stop offset="100%" stopColor="#7a1c31" stopOpacity="0.01" />
                                  </linearGradient>
                                </defs>
                                
                                {/* Majestic Layered Sharp Mountain Range Backdrop (Geometric Peaks) */}
                                <g className="opacity-60 pointer-events-none">
                                  {/* Far sharp mountains left and right */}
                                  <polygon points={`0,${totalScrollHeight * 0.05} 12,${totalScrollHeight * 0.12} 0,${totalScrollHeight * 0.22}`} fill="url(#mountainGradFar)" />
                                  <polyline points={`0,${totalScrollHeight * 0.05} 12,${totalScrollHeight * 0.12} 0,${totalScrollHeight * 0.22}`} fill="none" stroke="#1e293b" strokeWidth="0.4" strokeOpacity="0.3" />

                                  <polygon points={`48,${totalScrollHeight * 0.2} 36,${totalScrollHeight * 0.28} 48,${totalScrollHeight * 0.38}`} fill="url(#mountainGradMid)" />
                                  <polyline points={`48,${totalScrollHeight * 0.2} 36,${totalScrollHeight * 0.28} 48,${totalScrollHeight * 0.38}`} fill="none" stroke="#c5a880" strokeWidth="0.4" strokeOpacity="0.4" />

                                  {/* Mid sharp mountain ridges */}
                                  <polygon points={`0,${totalScrollHeight * 0.45} 14,${totalScrollHeight * 0.52} 0,${totalScrollHeight * 0.62}`} fill="url(#mountainGradNear)" />
                                  <polyline points={`0,${totalScrollHeight * 0.45} 14,${totalScrollHeight * 0.52} 0,${totalScrollHeight * 0.62}`} fill="none" stroke="#7a1c31" strokeWidth="0.4" strokeOpacity="0.3" />

                                  <polygon points={`48,${totalScrollHeight * 0.6} 34,${totalScrollHeight * 0.68} 48,${totalScrollHeight * 0.78}`} fill="url(#mountainGradMid)" />
                                  <polyline points={`48,${totalScrollHeight * 0.6} 34,${totalScrollHeight * 0.68} 48,${totalScrollHeight * 0.78}`} fill="none" stroke="#c5a880" strokeWidth="0.4" strokeOpacity="0.4" />

                                  {/* Near crisp foreground peaks */}
                                  <polygon points={`0,${totalScrollHeight * 0.8} 11,${totalScrollHeight * 0.85} 0,${totalScrollHeight * 0.94}`} fill="url(#mountainGradFar)" />
                                  <polyline points={`0,${totalScrollHeight * 0.8} 11,${totalScrollHeight * 0.85} 0,${totalScrollHeight * 0.94}`} fill="none" stroke="#1e293b" strokeWidth="0.4" strokeOpacity="0.3" />

                                  <polygon points={`48,${totalScrollHeight * 0.84} 37,${totalScrollHeight * 0.9} 48,${totalScrollHeight * 0.98}`} fill="url(#mountainGradNear)" />
                                  <polyline points={`48,${totalScrollHeight * 0.84} 37,${totalScrollHeight * 0.9} 48,${totalScrollHeight * 0.98}`} fill="none" stroke="#7a1c31" strokeWidth="0.4" strokeOpacity="0.4" />
                                </g>
 
                                {/* The Curvy Road Centerline Tarmac */}
                                <path
                                  ref={roadPathRef}
                                  d={getCurvyPath()}
                                  fill="none"
                                  stroke="url(#roadGrad)"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  className="opacity-95"
                                />
                                
                                {/* Yellow Dashed Center Lane Dividers */}
                                <path
                                  d={getCurvyPath()}
                                  fill="none"
                                  stroke="#fbbf24"
                                  strokeWidth="0.8"
                                  strokeLinecap="round"
                                  strokeDasharray="2 3"
                                  className="opacity-100"
                                />
                              </svg>
 
                              {/* Stylized High-Detailed Off-Road Expedition SUV (car moves as we scroll) */}
                              <div 
                                ref={carRef}
                                className={`absolute z-20 w-10 h-10 rounded-full bg-white border-2 border-alpine-burgundy/30 flex items-center justify-center shadow-md pointer-events-none transition-transform duration-300 ${isAutoplayActive ? 'car-moving' : ''}`}
                                style={{ 
                                  left: `${carScrollX}px`,
                                  top: `${carScrollY}px`,
                                  transform: `translate(-50%, -50%) rotate(${carAngle}deg)`
                                }}
                              >
                                <svg viewBox="0 0 32 32" className="w-7 h-7 text-alpine-burgundy" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  {/* Cargo roof rack carrier */}
                                  <path d="M 10,6 L 22,6 M 12,4 L 20,4 M 14,4 L 14,6 M 18,4 L 18,6" stroke="#475569" strokeWidth="1.2" />
                                  
                                  {/* Windshield & Windows */}
                                  <path d="M 7,14 L 10,7 L 22,7 L 25,14 Z" fill="#f1f5f9" stroke="currentColor" strokeWidth="1.5" />
                                  <line x1="16" y1="7" x2="16" y2="14" stroke="currentColor" strokeWidth="1" />
                                  
                                  {/* Main SUV chassis body frame with heavy-duty bumper */}
                                  <path d="M 3,14 L 29,14 C 29.5,14 30,14.5 30,15 L 30,20 C 30,20.5 29.5,21 29,21 L 26,21 C 26,19 24,19 24,21 L 8,21 C 8,19 6,19 6,21 L 3,21 C 2.5,21 2,20.5 2,20 L 2,15 C 2,14.5 2.5,14 3,14 Z" fill="#7a1c31" stroke="currentColor" strokeWidth="1.8" />
                                  
                                  {/* Adventure side snorkel */}
                                  <path d="M 6,14 L 6,10 L 8,9" stroke="#1e293b" strokeWidth="1.2" />
                                  
                                  {/* Headlamp Warm Light beam flare projection */}
                                  <polygon points="28,17 32,15 32,19" fill="#fef08a" opacity="0.8" className="animate-pulse" />
                                  
                                  {/* Left Wheel */}
                                  <g className="wheel-left">
                                    <circle cx="8" cy="21" r="4.2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                                    <circle cx="8" cy="21" r="2" fill="#94a3b8" />
                                    <line x1="8" y1="18.8" x2="8" y2="23.2" stroke="#0f172a" strokeWidth="0.8" />
                                    <line x1="5.8" y1="21" x2="10.2" y2="21" stroke="#0f172a" strokeWidth="0.8" />
                                  </g>
                                  
                                  {/* Right Wheel */}
                                  <g className="wheel-right">
                                    <circle cx="24" cy="21" r="4.2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                                    <circle cx="24" cy="21" r="2" fill="#94a3b8" />
                                    <line x1="24" y1="18.8" x2="24" y2="23.2" stroke="#0f172a" strokeWidth="0.8" />
                                    <line x1="21.8" y1="21" x2="26.2" y2="21" stroke="#0f172a" strokeWidth="0.8" />
                                  </g>
 
                                  {/* Rear spare wheel mounted carrier */}
                                  <path d="M 2,15 A 2.5,2.5 0 0,0 2,20" stroke="#334155" strokeWidth="2.5" />
                                </svg>
                              </div>
                            </div>
 
                            <div className="space-y-4" onMouseLeave={() => setIsAutoplayActive(true)}>
                              {pkg.itinerary.map((day, idx) => {
                                const isEven = idx % 2 === 0;
                                const stopLeftOffset = isEven ? '-42px' : '-22px';
                                return (
                                  <div 
                                    key={idx} 
                                    ref={el => { itineraryItemRefs.current[idx] = el; }}
                                    onMouseEnter={() => {
                                      setIsAutoplayActive(false); // Stop auto-driving on manual hover selection
                                      setActiveDayIndex(idx);
                                      const progress = idx / (pkg.itinerary.length - 1 || 1);
                                      animationProgressRef.current = progress;
                                      const coords = getCoordsForProgress(progress);
                                      setCarScrollX(coords.x);
                                      setCarScrollY(coords.y);
                                      setCarAngle(coords.angle);
                                    }}
                                    className={`relative pl-2 py-2.5 pr-3 font-sans rounded-xl transition-all duration-300 border ${
                                      activeDayIndex === idx 
                                        ? 'bg-alpine-burgundy/[0.04] border-alpine-burgundy/20 shadow-sm' 
                                        : 'border-transparent hover:bg-slate-50/50'
                                    } cursor-pointer`}
                                  >
                                    {/* Traffic-Style Day Stop Marker positioned precisely atop the curvy road nodes */}
                                    <div 
                                      className={`stop-bullet absolute top-5.5 w-4.5 h-4.5 rounded-full border-2 transition-all duration-300 z-10 flex items-center justify-center ${
                                        activeDayIndex === idx 
                                          ? 'bg-alpine-burgundy border-white scale-110 shadow-md' 
                                          : 'bg-white border-slate-300'
                                      }`}
                                      style={{ left: stopLeftOffset }}
                                    >
                                      <div className={`w-1.5 h-1.5 rounded-full ${activeDayIndex === idx ? 'bg-white' : 'bg-slate-300'}`} />
                                    </div>
                                    
                                    <p className="text-[9px] font-mono font-bold text-alpine-burgundy uppercase m-0 tracking-wider">Day {day.day}</p>
                                    <h4 className="text-sm font-serif font-black text-alpine-charcoal m-0">{day.title}</h4>
                                    <p className="text-xs text-slate-500 m-0 leading-relaxed font-semibold mt-1">{day.description}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="md:col-span-5 hidden md:block">
                            <div className="rounded-2xl overflow-hidden border border-alpine-burgundy/10 shadow-sm relative group h-full min-h-[220px]">
                              <LazyImage 
                                src={pkg.heroImage} 
                                alt={pkg.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'highlights' && (
                      <div className="space-y-4 text-left">
                        <h3 className="text-lg font-serif text-alpine-charcoal font-black pb-2 border-b border-alpine-burgundy/5">Expedition Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-7 space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {pkg.highlights.map((hl, i) => (
                              <div key={i} className="p-3.5 bg-white border border-alpine-burgundy/5 rounded-xl flex gap-3 font-sans font-semibold shadow-sm hover:border-alpine-burgundy/15 transition-all">
                                <div className="w-5.5 h-5.5 rounded-full bg-alpine-burgundy/10 text-alpine-burgundy flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                                <span className="text-xs text-slate-600 leading-normal">{hl}</span>
                              </div>
                            ))}
                          </div>
                          <div className="md:col-span-5 hidden md:block">
                            <div className="rounded-2xl overflow-hidden border border-alpine-burgundy/10 shadow-sm relative group h-full min-h-[220px]">
                              <LazyImage 
                                src={pkg.galleryImages[0] || pkg.heroImage} 
                                alt="Highlight landscape visual" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                                <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-white/95 bg-alpine-burgundy px-2 py-0.5 rounded-full w-fit mb-1 font-sans">Scenic Landmark</span>
                                <h4 className="text-xs font-serif font-bold text-white m-0">{pkg.title} Panorama</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'inclusions' && (
                      <div className="space-y-4 text-left">
                        <h3 className="text-lg font-serif text-alpine-charcoal font-black pb-2 border-b border-alpine-burgundy/5">Inclusions & Exclusions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-7 space-y-6 max-h-[350px] overflow-y-auto pr-1">
                            <div>
                              <h4 className="text-[10px] font-mono uppercase tracking-wider text-alpine-burgundy font-bold mb-2">Private Package Inclusions</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {pkg.inclusions.map((inc, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600 font-semibold font-sans bg-white border border-slate-100 p-2 rounded-lg">
                                    <span className="text-emerald-600 font-black mt-0.5 shrink-0">✓</span>
                                    <span>{inc}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {pkg.exclusions && pkg.exclusions.length > 0 && (
                              <div className="border-t border-alpine-burgundy/5 pt-4">
                                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">Package Exclusions</h4>
                                <div className="grid grid-cols-1 gap-2">
                                  {pkg.exclusions.map((exc, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-500 font-semibold font-sans bg-slate-50/50 p-2 rounded-lg">
                                      <span className="text-red-600 font-black mt-0.5 shrink-0">✗</span>
                                      <span>{exc}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="md:col-span-5 hidden md:block">
                            <div className="rounded-2xl overflow-hidden border border-alpine-burgundy/10 shadow-sm relative group h-full min-h-[220px]">
                              <LazyImage 
                                src={pkg.galleryImages[2] || pkg.galleryImages[1] || pkg.galleryImages[0] || pkg.heroImage} 
                                alt="Package inclusions landscape visual" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                                <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-white/95 bg-alpine-burgundy px-2 py-0.5 rounded-full w-fit mb-1 font-sans">Premium Stay & Travel</span>
                                <h4 className="text-xs font-serif font-bold text-white m-0">All-Inclusive Luxury Setups</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'quote' && (
                      <form onSubmit={handleInquirySubmit} className="space-y-4 text-left w-full max-w-lg mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label htmlFor="full-name" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Full Name *</label>
                            <input
                              id="full-name"
                              type="text"
                              required
                              disabled={submitting}
                              placeholder="Your Name"
                              value={formData.fullName}
                              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                              className="w-full bg-white border border-alpine-burgundy/15 rounded-lg px-4 py-2.5 text-xs text-alpine-charcoal font-semibold focus:outline-none focus:border-alpine-burgundy disabled:opacity-50"
                            />
                          </div>

                          <div className="space-y-1">
                            <label htmlFor="phone-number" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Phone Number *</label>
                            <input
                              id="phone-number"
                              type="tel"
                              required
                              disabled={submitting}
                              placeholder="e.g. +91 98765 43210"
                              value={formData.phoneNumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                              className="w-full bg-white border border-alpine-burgundy/15 rounded-lg px-4 py-2.5 text-xs text-alpine-charcoal font-semibold focus:outline-none focus:border-alpine-burgundy disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label htmlFor="travel-date" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Preferred Route Date *</label>
                            <input
                              id="travel-date"
                              type="date"
                              required
                              disabled={submitting}
                              value={formData.selectedDate}
                              onChange={(e) => setFormData(prev => ({ ...prev, selectedDate: e.target.value }))}
                              className="w-full bg-white border border-alpine-burgundy/15 rounded-lg px-4 py-2.5 text-xs text-alpine-charcoal font-semibold focus:outline-none focus:border-alpine-burgundy disabled:opacity-50"
                            />
                          </div>

                          <div className="space-y-1">
                            <label htmlFor="travel-duration" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">How many days do you want to travel? *</label>
                            <input
                              id="travel-duration"
                              type="text"
                              required
                              disabled={submitting}
                              placeholder="e.g. 7 Days, 10 Days"
                              value={formData.travelDuration}
                              onChange={(e) => setFormData(prev => ({ ...prev, travelDuration: e.target.value }))}
                              className="w-full bg-white border border-alpine-burgundy/15 rounded-lg px-4 py-2.5 text-xs text-alpine-charcoal font-semibold focus:outline-none focus:border-alpine-burgundy disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="guests-count" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Group Members</label>
                          <select
                            id="guests-count"
                            disabled={submitting}
                            value={formData.guests}
                            onChange={(e) => setFormData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                            className="w-full bg-white border border-alpine-burgundy/15 rounded-lg px-4 py-2.5 text-xs text-alpine-charcoal font-semibold focus:outline-none focus:border-alpine-burgundy"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(n => (
                              <option key={n} value={n} className="bg-white text-alpine-charcoal font-semibold">{n} Traveler{n > 1 && 's'}</option>
                            ))}
                          </select>
                        </div>

                        {/* Explicit customer budget inputs requested for every inquiry */}
                        <div className="p-4 rounded-xl border border-alpine-burgundy/10 bg-slate-50/50 space-y-3 font-sans">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-alpine-burgundy font-mono m-0">Required Customer Budget Configuration</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label htmlFor="package-budget-type" className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Budget Type *</label>
                              <div className="flex gap-2">
                                {['Per Person', 'Total Group'].map(type => (
                                  <button
                                    type="button"
                                    key={type}
                                    disabled={submitting}
                                    onClick={() => setFormData(prev => ({ ...prev, budgetType: type }))}
                                    className={`flex-1 py-2 rounded-lg border text-center transition-all text-xs font-semibold cursor-pointer ${
                                      formData.budgetType === type
                                        ? 'bg-alpine-burgundy text-white border-alpine-burgundy shadow-sm'
                                        : 'bg-white border-alpine-burgundy/10 text-slate-600 hover:border-alpine-burgundy/20'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="package-budget-amount" className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Approx Budget Amount *</label>
                              <input
                                id="package-budget-amount"
                                type="text"
                                disabled={submitting}
                                required
                                placeholder="e.g. ₹20,000 or custom range"
                                value={formData.budgetAmount}
                                onChange={(e) => setFormData(prev => ({ ...prev, budgetAmount: e.target.value }))}
                                className="w-full bg-white border border-alpine-burgundy/15 rounded-lg px-3 py-2 text-xs text-alpine-charcoal font-semibold focus:outline-none focus:border-alpine-burgundy shadow-inner"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="notes" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Custom Requirements / Logistics Alignment (Optional)</label>
                          <textarea
                            id="notes"
                            rows={2}
                            disabled={submitting}
                            placeholder="Specify special dietary custom meals, photography guides, medical/altitude alerts..."
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full bg-white border border-alpine-burgundy/15 rounded-lg px-4 py-2 text-xs text-alpine-charcoal font-semibold focus:outline-none focus:border-alpine-burgundy disabled:opacity-50 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-3.5 mt-2 bg-alpine-burgundy hover:bg-alpine-burgundy-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-50"
                        >
                          {submitting ? 'Compiling Proposal...' : 'Compile Itinerary Quote'}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
