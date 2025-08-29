import React, {useState, useEffect} from 'react';
import {useCountdown} from './useCountdown';

interface VibrantComingSoonProps {
  launchDate?: Date | string;
  logoPath?: string;
  brandName?: string;
}

const VibrantComingSoon: React.FC<VibrantComingSoonProps> = ({
  launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  logoPath = '/logos/BRANDLOGOTEST_mask.png',
  brandName = 'f4rmula',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  const {days, hours, minutes, seconds, isComplete} = useCountdown({
    targetDate: launchDate,
    onComplete: () => console.log('Launch time!'),
  });

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitted) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/2 -right-20 w-96 h-96 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{animationDelay: '0.7s'}}
        ></div>
        <div
          className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{animationDelay: '1s'}}
        ></div>
      </div>

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Logo with Floating Animation */}
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-orange-500 to-blue-600 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
          <div className="relative animate-bounce">
            <img
              src={logoPath}
              alt={brandName}
              className="w-40 h-40 md:w-56 md:h-56 object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Fallback to a gradient circle if image doesn't load
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-violet-600 via-orange-500 to-blue-600 flex items-center justify-center">
                      <span class="text-white text-4xl md:text-6xl font-bold">F4</span>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>

        {/* Brand Name with Gradient Effect */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tighter">
          <span
            className="bg-gradient-to-r from-violet-400 via-orange-400 to-blue-400 bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient 4s ease infinite',
            }}
          >
            {brandName}
          </span>
        </h1>

        {/* Coming Soon Text */}
        <p
          className="text-2xl md:text-3xl text-gray-300 mb-12 font-light tracking-widest uppercase opacity-0 animate-fade-in"
          style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}
        >
          Coming Soon
        </p>

        {/* Countdown Timer with Glass Morphism */}
        {!isComplete ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-4xl w-full">
            {[
              {
                value: days,
                label: 'Days',
                color: 'from-violet-500 to-purple-600',
              },
              {
                value: hours,
                label: 'Hours',
                color: 'from-orange-500 to-amber-600',
              },
              {
                value: minutes,
                label: 'Minutes',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                value: seconds,
                label: 'Seconds',
                color: 'from-pink-500 to-rose-600',
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className="relative group opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${(index + 3) * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}
                ></div>

                {/* Glass Card */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300">
                  <div
                    className={`text-4xl md:text-6xl font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent text-center font-mono`}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 text-center mt-2 uppercase tracking-wider font-medium">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-black">
              <span className="bg-gradient-to-r from-violet-400 via-orange-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                WE&apos;RE LIVE! 🚀
              </span>
            </h2>
          </div>
        )}

        {/* Email Signup with Gradient Border */}
        <div
          className="w-full max-w-lg mb-12 opacity-0 animate-fade-in"
          style={{
            animationDelay: '0.7s',
            animationFillMode: 'forwards',
          }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-violet-600 via-orange-600 to-blue-600">
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-950 rounded-2xl p-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:bg-white/5 rounded-xl transition-all"
                  disabled={isSubmitting || isSubmitted}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`
                    px-8 py-4 rounded-xl font-bold transition-all duration-300 relative overflow-hidden
                    ${
                      isSubmitted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : isSubmitting
                          ? 'bg-gray-800 text-gray-400 cursor-wait'
                          : 'bg-gradient-to-r from-violet-600 via-orange-600 to-blue-600 text-white hover:shadow-2xl hover:shadow-orange-500/25 hover:scale-105'
                    }
                  `}
                >
                  <span className="relative z-10">
                    {isSubmitted
                      ? '✓ Success'
                      : isSubmitting
                        ? 'Sending...'
                        : 'Notify Me'}
                  </span>
                </button>
              </div>
            </div>
            {isSubmitted && (
              <p className="text-green-400 text-sm mt-4 text-center animate-fade-in">
                Awesome! We&apos;ll let you know when we launch.
              </p>
            )}
          </form>
        </div>

        {/* Social Links or Footer */}
        <div
          className="text-gray-500 text-sm opacity-0 animate-fade-in flex items-center gap-2"
          style={{
            animationDelay: '0.9s',
            animationFillMode: 'forwards',
          }}
        >
          <span>© 2025 {brandName}</span>
          <span className="text-gray-700">•</span>
          <span>Something amazing is coming</span>
        </div>
      </div>
    </div>
  );
};

export default VibrantComingSoon;
