import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export default function SplashScreen({ onGetStarted }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#0F0F0F] flex flex-col items-center justify-center px-6 z-50">
      {/* Purple glow */}
      <div className="absolute top-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 w-40 h-40 bg-purple-500/15 rounded-full blur-[60px]" />

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-6 p-5 rounded-2xl bg-purple-600/10 border border-purple-500/20">
          <ShieldCheck className="w-16 h-16 text-purple-500" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          revokemywallet
        </h1>

        <p className="text-gray-400 text-sm mb-8 max-w-[280px]">
          Safe Revoke • Powered by{' '}
          <span className="text-purple-400">@revokemywalletbot</span> by luke
        </p>

        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 mb-10 max-w-[320px]">
          <p className="text-gray-400 text-xs leading-relaxed">
            🔒 revokemywallet never stores your private key. All transactions are
            signed locally in your wallet.
          </p>
        </div>

        <button
          onClick={onGetStarted}
          className="w-full max-w-[300px] py-3.5 px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-xl transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
