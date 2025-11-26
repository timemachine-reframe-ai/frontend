import React, { useEffect, useState } from 'react';

const TimeTravelAnimation: React.FC = () => {
  const [text, setText] = useState('시간 여행 준비 중...');

  useEffect(() => {
    const timer1 = setTimeout(() => setText('과거로 이동합니다...'), 1000);
    const timer2 = setTimeout(() => setText('그때의 감정을 다시 마주하러 갑니다.'), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden">
      {/* Warp Effect Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-0 animate-warp-line"
            style={{
              '--angle': `${Math.random() * 360}deg`,
              '--delay': `${Math.random() * 2}s`,
              '--duration': `${0.6 + Math.random() * 0.4}s`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: '50%',
              top: '50%',
              transformOrigin: 'left center',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Tunnel effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[100vmax] h-[100vmax] rounded-full border-[100px] border-primary-500/10 animate-tunnel opacity-0" />
        <div className="absolute w-[80vmax] h-[80vmax] rounded-full border-[80px] border-secondary-500/10 animate-tunnel opacity-0" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Central content */}
      <div className="relative z-10 text-center animate-fade-in-up">
        <div className="mb-12 relative flex items-center justify-center w-40 h-40 mx-auto">
          {/* Magical Rings */}
          <div className="absolute inset-0 rounded-full border-[4px] border-transparent border-t-primary-400/90 border-l-primary-400/40 animate-ring-spin" />
          <div className="absolute inset-3 rounded-full border-[4px] border-transparent border-b-secondary-400/90 border-r-secondary-400/40 animate-ring-spin-reverse" />
          <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-2xl animate-pulse-slow" />

          {/* Floating Hourglass */}
          <div className="text-7xl animate-float relative z-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">
            ⏳
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
          {text}
        </h2>

        <div className="w-64 h-1.5 bg-gray-800 rounded-full mx-auto overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-primary-500 via-purple-400 to-secondary-500 animate-progress shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
        </div>
      </div>

      <style>{`
        @keyframes warp-line {
          0% {
            transform: rotate(var(--angle)) translateX(0) scaleX(0.1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: rotate(var(--angle)) translateX(100vmax) scaleX(1);
            opacity: 0;
          }
        }
        @keyframes tunnel {
          0% { transform: scale(0.1); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ring-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        .animate-warp-line {
          animation: warp-line var(--duration) linear infinite;
          animation-delay: var(--delay);
          opacity: 0;
          will-change: transform, opacity;
        }
        .animate-tunnel {
          animation: tunnel 2s ease-out infinite;
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
        .animate-ring-spin {
          animation: ring-spin 3s linear infinite;
        }
        .animate-ring-spin-reverse {
          animation: ring-spin-reverse 4s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default TimeTravelAnimation;
