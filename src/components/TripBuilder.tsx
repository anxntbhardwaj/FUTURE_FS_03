import React, { useState, useEffect } from 'react';
import { Compass, Check, Users, Calendar, MapPin, Clock, Wallet, ShieldCheck, Car, Heart, Smile, Send, X } from 'lucide-react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TripBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfile | null;
  triggerSecurityCheck?: (onVerifySuccess: () => void) => void;
}

export default function TripBuilder({ isOpen, onClose, profile, triggerSecurityCheck }: TripBuilderProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [configId, setConfigId] = useState('');

  // Nothing is selected or filled beforehand! All are blank to start.
  const [choices, setChoices] = useState({
    destinationType: '',
    placesWanted: '',
    date: '',
    duration: '',
    guests: '',
    startingCity: '',
    budgetType: 'Per Person',
    budgetAmount: '',
    travelStyle: '',
    vehiclePreference: '',
    requirements: '',
    fullName: profile?.fullName || '',
    phoneNumber: profile?.phoneNumber || '',
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCompleted(false);
      setConfigId('');
      setChoices({
        destinationType: '',
        placesWanted: '',
        date: '',
        duration: '',
        guests: '',
        startingCity: '',
        budgetType: 'Per Person',
        budgetAmount: '',
        travelStyle: '',
        vehiclePreference: '',
        requirements: '',
        fullName: profile?.fullName || '',
        phoneNumber: profile?.phoneNumber || '',
      });
    }
  }, [isOpen, profile]);

  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWhatsAppLink = (inqId?: string) => {
    const currentInquiryId = inqId || configId || `inq-custom-${Date.now()}`;
    const textMsg = encodeURIComponent(
      `*ALPINE GOAT ADVENTURES - BESPOKE TRIP PLAN*\n\n` +
      `Hello! I have configured a custom travel plan on your platform:\n\n` +
      `*Traveler:* ${choices.fullName}\n` +
      `*Phone:* ${choices.phoneNumber}\n` +
      `*Trip Destination:* ${choices.destinationType || 'Not Specified'}\n` +
      `*Places Desired:* ${choices.placesWanted || 'Not Specified'}\n` +
      `*Start Date:* ${choices.date || 'Flexible'}\n` +
      `*Trip Duration:* ${choices.duration || 'Not Specified'}\n` +
      `*Group Size:* ${choices.guests || 'Not Specified'} Travelers\n` +
      `*Starting City:* ${choices.startingCity || 'Not Specified'}\n` +
      `*Approx Budget:* ${choices.budgetType} - ${choices.budgetAmount || 'Not Specified'}\n` +
      `*Comfort Level:* ${choices.travelStyle || 'Not Specified'}\n` +
      `*Vehicle Choice:* ${choices.vehiclePreference || 'Not Specified'}\n` +
      `*Bespoke Notes:* ${choices.requirements || 'None'}\n\n` +
      `*Inquiry ID:* ${currentInquiryId}\n\n` +
      `Please connect me with an alpine curator to finalize. Thank you!`
    );
    return `https://wa.me/918894699271?text=${textMsg}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!choices.fullName.trim()) {
      alert("Please enter your Full Name so we know who you are.");
      return;
    }
    if (!choices.phoneNumber.trim()) {
      alert("Please enter your Phone Number so we can reach you.");
      return;
    }
    if (!choices.destinationType.trim()) {
      alert("Please select or enter your Desired Destination.");
      return;
    }
    if (!choices.date) {
      alert("Please select a preferred Start Date for your adventure.");
      return;
    }

    setLoading(true);
    const inquiryId = `inq-custom-${Date.now()}`;
    setConfigId(inquiryId);

    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
      const link = getWhatsAppLink(inquiryId);
      window.open(link, '_blank');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-alpine-charcoal/80 backdrop-blur-md"
        />

        {/* Modal Sheet Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white w-full max-w-2xl rounded-3xl overflow-y-auto max-h-[92vh] shadow-2xl border border-alpine-burgundy/15 relative z-10 flex flex-col text-left"
        >
          {/* Top Banner Ribbon */}
          <div className="bg-alpine-charcoal text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-gold-accent animate-spin-slow" />
              <div>
                <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gold-accent uppercase m-0">
                  Custom Expedition Curators
                </p>
                <h3 className="text-sm font-serif font-bold text-white m-0">
                  Bespoke Trip Planner
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer border-none bg-transparent outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6">
            {completed ? (
              <div className="text-center py-12 space-y-6 flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif text-alpine-charcoal font-bold m-0">Plan Submitted to Curators!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-semibold">
                    Your custom travel preferences have been successfully generated. Reference Code:{' '}
                    <strong className="font-mono text-alpine-burgundy bg-alpine-burgundy/5 px-2 py-0.5 rounded border border-alpine-burgundy/10">
                      {configId}
                    </strong>
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto font-medium">
                    We have opened WhatsApp to connect you directly with our senior mountain planners in Shimla to finalize your pricing and permissions.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center pt-4">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md cursor-pointer decoration-none"
                  >
                    <Compass className="w-4 h-4 text-white" />
                    Open WhatsApp Chat
                  </a>
                  <button
                    type="button"
                    onClick={() => setCompleted(false)}
                    className="px-5 py-3 border border-alpine-burgundy/15 bg-white hover:bg-alpine-cream-light text-slate-700 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    Modify Form Choices
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                {/* Visual Header Intro */}
                <div className="border-b border-slate-100 pb-4">
                  <h4 className="text-base font-serif font-bold text-alpine-charcoal m-0">Configure Your Journey</h4>
                  <p className="text-xs text-slate-500 font-semibold m-0 mt-1 font-sans">
                    Tell us your travel style, destinations, and requirements. We will design a custom itinerary with permissions and private 4x4 options.
                  </p>
                </div>

                {/* Section 1: Traveler Profile */}
                <div className="space-y-3.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-alpine-burgundy">1. Traveler Credentials</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={choices.fullName}
                        onChange={e => setChoices(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Contact Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={choices.phoneNumber}
                        onChange={e => setChoices(p => ({ ...p, phoneNumber: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Journey Configuration */}
                <div className="space-y-3.5 pt-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-alpine-burgundy">2. Route & Location Details</span>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Desired Destination / Region *</label>
                    <select
                      required
                      value={choices.destinationType}
                      onChange={e => setChoices(p => ({ ...p, destinationType: e.target.value }))}
                      className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="" disabled>-- Select Mountain Region --</option>
                      <option value="Spiti Overland (Himachal)">Spiti Overland (Himachal Desert)</option>
                      <option value="Kashmir Great Lakes (Kashmir)">Kashmir Great Lakes (Alpine Valleys)</option>
                      <option value="Ladakh Heights (Leh)">Ladakh Heights & Pangong</option>
                      <option value="Meghalaya Clouds (North East)">Meghalaya Rainforests & Bridges</option>
                      <option value="Royal Rajasthan (West)">Royal Rajasthan Dunes & Forts</option>
                      <option value="Kerala Backwaters (South)">Kerala Backwaters & Hills</option>
                      <option value="Manali & Lahaul Valley">Lahaul & Keylong Valleys</option>
                      <option value="Custom Himalayan Loop">Custom Route (Tell us in notes)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Preferred Departure Date *</label>
                      <input
                        type="date"
                        required
                        min={getMinDate()}
                        value={choices.date}
                        onChange={e => setChoices(p => ({ ...p, date: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">How many days do you want to travel? *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 7 Days, 10 Days"
                        value={choices.duration}
                        onChange={e => setChoices(p => ({ ...p, duration: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Number of Travelers *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="100"
                        placeholder="e.g. 4"
                        value={choices.guests}
                        onChange={e => setChoices(p => ({ ...p, guests: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Starting City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi, Chandigarh, Shimla"
                        value={choices.startingCity}
                        onChange={e => setChoices(p => ({ ...p, startingCity: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Places Desired to Visit</label>
                    <input
                      type="text"
                      placeholder="e.g. Chandratal Lake, Kaza, Kibber, Dhankar Monastery..."
                      value={choices.placesWanted}
                      onChange={e => setChoices(p => ({ ...p, placesWanted: e.target.value }))}
                      className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3.5 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Section 3: Comfort & Preferences */}
                <div className="space-y-3.5 pt-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-alpine-burgundy">3. Preferences & Budget Bracket</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Travel Style & Comfort *</label>
                      <select
                        required
                        value={choices.travelStyle}
                        onChange={e => setChoices(p => ({ ...p, travelStyle: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="" disabled>-- Select Style --</option>
                        <option value="Luxury (Premium stays & slow pace)">Luxury Stays & Premium hotels</option>
                        <option value="Adventure Camps (Campgrounds & off-grid)">Adventure Camps & Trekking</option>
                        <option value="Family comfort (Leisurely transitions)">Family-friendly leisure pace</option>
                        <option value="Solo explorer (Local homestays)">Solo climber / Local Homestays</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Preferred Fleet Vehicle *</label>
                      <select
                        required
                        value={choices.vehiclePreference}
                        onChange={e => setChoices(p => ({ ...p, vehiclePreference: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="" disabled>-- Select Vehicle --</option>
                        <option value="Mahindra Thar 4x4 (Ultimate Off-roader)">Mahindra Thar 4x4 Cruiser</option>
                        <option value="Toyota Fortuner (Luxury High-End)">Toyota Fortuner 4x4 Cruiser</option>
                        <option value="Force Gurkha / Tempo Traveller (Groups)">Premium Tempo Traveller (Group Coach)</option>
                        <option value="Premium Tarmac Sedan">Couples Luxury Sedan</option>
                        <option value="Flexible / Multimodal">Flexible (Flight or Rail connectivity)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Budget Type</label>
                      <div className="flex gap-2">
                        {['Per Person', 'Total Group'].map(type => (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setChoices(p => ({ ...p, budgetType: type }))}
                            className={`flex-1 py-2 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer ${
                              choices.budgetType === type
                                ? 'bg-alpine-burgundy text-white border-alpine-burgundy shadow-sm'
                                : 'bg-slate-50 border-alpine-burgundy/10 text-slate-600 hover:border-alpine-burgundy/20 hover:bg-white'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Approx Budget Amount *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹25,000 or write your budget"
                        value={choices.budgetAmount}
                        onChange={e => setChoices(p => ({ ...p, budgetAmount: e.target.value }))}
                        className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">Special Requests / Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Acclimatization requests, oxygen requirements, organic vegetarian meal prep, family needs..."
                      value={choices.requirements}
                      onChange={e => setChoices(p => ({ ...p, requirements: e.target.value }))}
                      className="w-full bg-slate-50 border border-alpine-burgundy/15 rounded-xl p-3 text-xs font-semibold text-alpine-charcoal focus:outline-none focus:border-alpine-burgundy focus:bg-white transition-all resize-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Footer buttons of the modal */}
                <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-3 border border-alpine-burgundy/15 bg-white hover:bg-alpine-cream-light text-slate-700 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    {loading ? 'Submitting selections...' : 'Connect to Curator via WhatsApp'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
