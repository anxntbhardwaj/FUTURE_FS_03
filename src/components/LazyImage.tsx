import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

export default function LazyImage({
  src = "",
  alt = "Alpine Goat Adventure",
  className = "",
  style,
  fallbackSrc = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
}: LazyImageProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before the image enters viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  // Reset states if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 1000);
    } else {
      setHasError(true);
    }
  };

  const currentSrc = hasError ? fallbackSrc : src;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-100/50 flex items-center justify-center ${className}`}
      style={{ ...style, minHeight: style?.minHeight || '80px' }}
    >
      {/* Dynamic Placeholder Shimmer / Blur-Up state */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-alpine-cream-light via-[#f5ebe0]/40 to-alpine-cream flex flex-col items-center justify-center z-10"
          >
            {/* Pulsing skeleton shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite] pointer-events-none" />
            
            {/* Elegant mountain silhouette or logo skeleton placeholder */}
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="flex flex-col items-center gap-1 text-slate-400"
            >
              <ImageIcon className="w-5 h-5 opacity-40 text-alpine-burgundy" />
              <span className="text-[9px] font-mono tracking-widest uppercase opacity-30 font-bold">ALPINES LOADING</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image Tag */}
      {isIntersecting && (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-750 ease-out ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-102'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          referrerPolicy="no-referrer"
        />
      )}

      {/* Fallback rendering logic in case of hard failure */}
      {hasError && isLoaded && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-alpine-charcoal/80 text-[8px] font-mono font-bold text-alpine-cream rounded backdrop-blur-xs pointer-events-none uppercase tracking-wider flex items-center gap-1 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Offline Cache Asset
        </div>
      )}
    </div>
  );
}
