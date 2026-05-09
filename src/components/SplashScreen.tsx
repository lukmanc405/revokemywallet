import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export default function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center px-6 z-50 overflow-hidden">
      {/* Background orbs — bold, saturated */}
      <div className="absolute top-[15%] left-[10%] w-56 h-56 bg-brand-red/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute top-[25%] right-[5%] w-48 h-48 bg-brand-blue/25 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[20%] left-[30%] w-44 h-44 bg-brand-yellow/15 rounded-full blur-[90px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[10%] right-[20%] w-32 h-32 bg-brand-blue/10 rounded-full blur-[60px] animate-pulse-dot" />

      {/* Grid pattern (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative flex flex-col items-center text-center w-full max-w-[360px]">
        {/* Accent line */}
        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-brand-red via-brand-blue to-brand-yellow mb-10 animate-fade-in" />

        {/* Shield icon — bold with glow ring */}
        <div className="relative mb-8 animate-scale-in">
          <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-brand-blue/20 blur-xl" />
          <div className="relative p-5 rounded-2xl bg-brand-surface border border-brand-blue/20">
            <ShieldCheck className="w-14 h-14 text-brand-blue" strokeWidth={1.5} />
          </div>
          {/* Decorative corner dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-red" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-brand-yellow" />
        </div>

        {/* Title */}
        <h1 className="text-[42px] font-extrabold tracking-[-0.04em] leading-none mb-3 animate-fade-in stagger-1">
          <span className="text-white">revoke</span>
          <span className="text-brand-blue">my</span>
          <span className="text-brand-red">wallet</span>
        </h1>

        <p className="text-gray-500 text-sm mb-10 tracking-wide font-medium animate-fade-in stagger-2">
          Secure • Fast • Multi-chain
        </p>

        {/* Features — bold color blocks */}
        <div className="w-full space-y-2.5 mb-10">
          {[
            { icon: '🔒', text: 'Your keys stay yours', accent: 'border-brand-blue/20', dot: 'bg-brand-blue' },
            { icon: '⚡', text: 'Individual revoke per tx', accent: 'border-brand-yellow/20', dot: 'bg-brand-yellow' },
            { icon: '🌐', text: '8 EVM chains supported', accent: 'border-brand-red/20', dot: 'bg-brand-red' },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-brand-surface border ${item.accent} animate-slide-up stagger-${i + 3}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-gray-200 text-sm font-semibold flex-1 text-left">{item.text}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
            </div>
          ))}
        </div>

        {/* CTA Button — gradient */}
        <button
          onClick={onGetStarted}
          className="w-full py-4 px-6 bg-gradient-to-r from-brand-blue to-brand-blue-light hover:from-brand-blue-light hover:to-brand-blue text-white font-bold text-base rounded-pill transition-all duration-300 btn-bold animate-slide-up stagger-6"
          style={{ boxShadow: '0 0 32px rgba(0, 122, 255, 0.3)' }}
        >
          Get Started
        </button>

        <p className="text-gray-700 text-xs mt-8 font-medium tracking-wide animate-fade-in stagger-7">
          by <span className="text-gray-500 font-semibold">@redmart09</span>
        </p>
      </div>
    </div>
  );
}
