import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Compass, ShieldCheck } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tag?: string;
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 'faq-acclimatization',
      question: 'How is altitude acclimatization managed on high-altitude routes?',
      tag: 'Altitude Safety',
      answer: 'We design our itineraries with gradual ascents. For high-altitude regions like Spiti or Ladakh (exceeding 10,000 feet), we integrate mandatory acclimatization rest days in lower valleys first. Our certified team monitors blood oxygen levels daily, carries professional-grade portable oxygen cylinders, and maintains emergency descent coordinates with the closest regional military or civil medical bases.'
    },
    {
      id: 'faq-gear',
      question: 'What gear and clothing are mandatory for Himalayan expeditions?',
      tag: 'Gear Guide',
      answer: 'Extreme temperatures require smart layering. We recommend three distinct layers: a thermal base layer, an insulating fleece mid-layer, and a heavy windproof/waterproof down jacket. Sturdy high-ankle trekking shoes, polarized UV sunglasses, wool socks, and a reliable power bank are essential. Upon booking, our curators share a highly detailed checklist and can help arrange premium gear rentals in Manali or Srinagar.'
    },
    {
      id: 'faq-cancellation',
      question: 'What is your cancellation and booking modification policy?',
      tag: 'Policies',
      answer: 'Due to the complexity of securing limited high-altitude vehicle clearances, local homestay reservations, and inner-line permits, our policy is structured as follows: Cancellations made 30+ days prior to departure receive a 90% refund. Cancellations between 15–30 days receive a 50% refund. Within 15 days, bookings are non-refundable, but we work tirelessly with local coordinators to facilitate dates rescheduling under documented force majeure circumstances.'
    },
    {
      id: 'faq-permits',
      question: 'How do you handle restricted zone permits and government clearances?',
      tag: 'Legality',
      answer: 'Alpine Goat handles 100% of the administrative clearance workflow. Certain routes near national borders (like Kaza, Kibber, or Pangong Lake) require specialized Inner Line Permits. We submit all documentation legally to SDM offices and local authority desks in advance. You only need to provide valid identity proofs (Aadhar card or Passport) during the reservation phase.'
    },
    {
      id: 'faq-weather',
      question: 'What happens in the event of unexpected landslides or pass closures?',
      tag: 'Emergency Rescue',
      answer: 'High-mountain weather is highly volatile. In the event of a landslide, sudden snowfall, or administrative road closure, our expert drivers and senior office coordinators immediately execute double-vetted backup itineraries. We arrange high-quality emergency stays and coordinate real-time clearance status with regional police control rooms to keep you comfortable and safe.'
    }
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="section-faq" className="max-w-4xl mx-auto px-6 py-12 scroll-mt-24 text-left">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-alpine-burgundy border-b-2 border-alpine-burgundy/25 pb-1">
          Common Concerns
        </span>
        <h2 className="text-4xl font-serif text-alpine-charcoal font-bold">Frequently Asked Questions</h2>
        <p className="text-sm text-slate-500 font-semibold max-w-xl mx-auto">
          Clear, honest, and expert answers regarding mountain logistics, safety, equipment, and administrative bookings.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div 
              key={item.id} 
              className="bg-white border border-alpine-burgundy/10 rounded-2xl overflow-hidden shadow-xs hover:border-alpine-burgundy/20 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(item.id)}
                aria-expanded={isOpen}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer outline-none bg-transparent hover:bg-slate-50/50 transition-colors select-none group min-h-[44px]"
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono font-extrabold uppercase bg-alpine-burgundy/5 text-alpine-burgundy px-2 py-0.5 rounded-md border border-alpine-burgundy/10">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-base font-serif font-bold text-alpine-charcoal group-hover:text-alpine-burgundy transition-colors leading-snug">
                    {item.question}
                  </h3>
                </div>
                <div 
                  className={`w-8 h-8 rounded-full bg-alpine-cream-light flex items-center justify-center text-alpine-burgundy border border-alpine-burgundy/5 group-hover:bg-alpine-burgundy/5 transition-all duration-300 ${isOpen ? 'rotate-180 bg-alpine-burgundy/5 text-alpine-burgundy' : ''}`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 border-t border-slate-50 text-xs md:text-sm text-slate-600 leading-relaxed font-semibold font-sans">
                      <p className="m-0 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Safety assurance notice card */}
      <div className="mt-8 p-5 bg-alpine-charcoal text-white rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <Compass className="w-5 h-5 text-gold-accent animate-spin-slow" />
          </div>
          <div>
            <p className="text-xs font-serif font-bold text-alpine-cream m-0">Still have custom questions or specific route queries?</p>
            <p className="text-[10px] text-slate-400 font-mono m-0 mt-0.5">OUR EXPEDITION OFFICE IN SHIMLA IS LIVE TO DISCUSS PERMISSIONS</p>
          </div>
        </div>
        <a
          href="tel:+918894699271"
          className="w-full sm:w-auto text-center px-4 py-2 bg-gold-accent hover:bg-gold-accent/90 text-alpine-charcoal font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer decoration-none"
        >
          Call Base Desk
        </a>
      </div>
    </section>
  );
}
