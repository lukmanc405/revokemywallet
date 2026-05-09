import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export default function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center px-6 z-50">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-brand-red/15 rounded-full blur-[80px] animate-pulse-dot" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-brand-blue/15 rounded-full blur-[60px] animate-pulse-dot" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/3 left-1/2 w-36 h-36 bg-brand-yellow/10 rounded-full blur-[70px] animate-pulse-dot" style={{ animationDelay: '1s' }} />

      <div className="relative flex flex-col items-center text-center animate-fade-in">
        {/* Icon */}
        <div className="mb-8 p-5 rounded-2xl bg-brand-blue/10 border border-brand-blue/20">
          <ShieldCheck className="w-16 h-16 text-brand-blue" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          <span className="text-white">revoke</span>
          <span className="text-brand-blue">my</span>
          <span className="text-brand-red">wallet</span>
        </h1>

        <p className="text-gray-500 text-sm mb-10 tracking-wide">
          Safe Revoke • Batch Multicall3
        </p>

        {/* Features */}
        <div className="w-full max-w-[320px] space-y-3 mb-10">
          {[
            { icon: '🔒', text: 'Never stores your private key', color: 'text-brand-blue' },
            { icon: '⚡', text: 'Batch revoke via Multicall3', color: 'text-brand-yellow' },
            { icon: '🌐', text: '8 EVM chains supported', color: 'text-brand-red' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-surface border border-white/5 animate-slide-up stagger-${i + 1}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-300 text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onGetStarted}
          className="w-full max-w-[300px] py-4 px-6 bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.98] text-white font-semibold rounded-pill transition-all duration-200"
        >
          Get Started
        </button>

        <p className="text-gray-600 text-xs mt-6">
          by <span className="text-gray-500">@redmart09</span>
        </p>
      </div>
    </div>
  );
}
