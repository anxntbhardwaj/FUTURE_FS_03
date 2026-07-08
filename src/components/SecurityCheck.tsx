import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SecurityCheckProps {
  isOpen: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

export default function SecurityCheck({ isOpen, onVerify, onCancel }: SecurityCheckProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaGrid, setCaptchaGrid] = useState<boolean[]>([false, false, false, false, false, false, false, false, false]);
  const [verifiedTarget, setVerifiedTarget] = useState<number[]>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setSuccess(false);
      setErrorMsg(null);
      setCaptchaGrid([false, false, false, false, false, false, false, false, false]);
      const targets = [2, 4, 6]; // Default simple target nodes representing peaks
      setVerifiedTarget(targets);
    }
  }, [isOpen]);

  const toggleCell = (index: number) => {
    if (errorMsg) setErrorMsg(null);
    const updated = [...captchaGrid];
    updated[index] = !updated[index];
    setCaptchaGrid(updated);
  };

  const checkVerification = () => {
    setLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      const allMatches = verifiedTarget.every(idx => captchaGrid[idx]);
      const extraSelected = captchaGrid.some((val, idx) => val && !verifiedTarget.includes(idx));
      
      if (allMatches && !extraSelected) {
        setSuccess(true);
        setTimeout(() => {
          onVerify();
        }, 1200);
      } else {
        setLoading(false);
        setErrorMsg("Verification failed. Please select ONLY the three mountain peak nodes (▲).");
      }
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-alpine-charcoal/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md p-8 text-center rounded-2xl bg-white border border-alpine-burgundy/15 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-alpine-burgundy" />

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-550"
              >
                <ShieldCheck className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-serif text-emerald-600 font-extrabold">Verification Safe</h2>
              <p className="text-sm text-slate-500 font-semibold">Continuing to Alpine Goat systems...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-alpine-burgundy/5 text-alpine-burgundy border border-alpine-burgundy/15">
                  <ShieldCheck className="w-8 h-8 text-current" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-black tracking-tight text-alpine-charcoal">Quick Security Verify</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  We require a verification check for important or large actions. Please select the three nodes representing <strong className="text-alpine-burgundy">mountain peaks (▲)</strong> to continue.
                </p>
              </div>

              {/* Grid Challenge */}
              <div className="grid grid-cols-3 gap-3 w-56 mx-auto my-6">
                {captchaGrid.map((selected, idx) => {
                  const isTarget = verifiedTarget.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleCell(idx)}
                      disabled={loading}
                      aria-label="Grid verification cell"
                      className={`h-16 rounded-lg transition-all border outline-none cursor-pointer ${
                        selected
                          ? 'bg-alpine-burgundy text-white border-alpine-burgundy shadow-inner'
                          : 'bg-alpine-cream-light border-alpine-burgundy/10 text-slate-500 hover:border-alpine-burgundy/25'
                      }`}
                    >
                      <span className="text-base font-bold select-none">
                        {isTarget ? '▲' : '●'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 p-2 rounded-lg animate-fadeIn text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 py-3 text-sm font-extrabold tracking-uppercase text-slate-500 hover:text-alpine-burgundy rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={checkVerification}
                  disabled={loading}
                  className="flex-1 bg-alpine-burgundy hover:bg-alpine-burgundy-dark text-white rounded-lg py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
