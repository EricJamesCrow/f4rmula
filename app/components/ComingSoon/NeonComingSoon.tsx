import React, {useState, useEffect} from 'react';
import {useCountdown} from './useCountdown';

interface NeonComingSoonProps {
  launchDate?: Date | string;
  logoPath?: string;
  brandName?: string;
}

const NeonComingSoon: React.FC<NeonComingSoonProps> = ({
  launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  logoPath = '/logos/BRANDLOGOTEST_mask.png',
  brandName = 'F4RMULA',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const {days, hours, minutes, seconds, isComplete} = useCountdown({
    targetDate: launchDate,
    onComplete: () => console.log('Launch time!'),
  });

  useEffect(() => {
    setIsLoaded(true);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);

    return () => clearInterval(glitchInterval);
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

  const glitchStyle = glitchActive
    ? {
        transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
        filter: 'hue-rotate(90deg)',
      }
    : {};

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Neon Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-fuchsia-500 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-[120px] opacity-30 animate-pulse"
          style={{animationDelay: '0.5s'}}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500 rounded-full blur-[150px] opacity-20 animate-pulse"
          style={{animationDelay: '1s'}}
        ></div>
      </div>

      {/* Scanlines Effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          )`,
        }}
      />

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={glitchStyle}
      >
        {/* Logo with Neon Glow */}
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-lime-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse"></div>
          <div className="relative">
            <img
              src={logoPath}
              alt={brandName}
              className="w-40 h-40 md:w-52 md:h-52 object-contain transform group-hover:scale-110 transition-transform duration-300"
              style={{
                filter:
                  'drop-shadow(0 0 40px rgba(255, 0, 255, 0.5)) drop-shadow(0 0 60px rgba(0, 255, 255, 0.3))',
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-40 h-40 md:w-52 md:h-52 rounded-full bg-black border-4 border-fuchsia-500 flex items-center justify-center" style="box-shadow: 0 0 40px rgba(255, 0, 255, 0.7), inset 0 0 40px rgba(0, 255, 255, 0.3);">
                      <span class="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text">F4</span>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>

        {/* Brand Name with Neon Text Effect */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 relative">
          <span
            className="text-transparent bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-lime-400 bg-clip-text"
            style={{
              textShadow: `
                0 0 20px rgba(255, 0, 255, 0.5),
                0 0 40px rgba(255, 0, 255, 0.3),
                0 0 60px rgba(0, 255, 255, 0.2)
              `,
            }}
          >
            {brandName}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-cyan-400 mb-12 font-mono uppercase tracking-[0.3em] animate-pulse">
          [ INITIALIZING ]
        </p>

        {/* Countdown Timer - Cyberpunk Style */}
        {!isComplete ? (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            {[
              {
                value: days,
                label: 'DAYS',
                color: 'fuchsia',
                rgb: '255, 0, 255',
              },
              {value: hours, label: 'HOURS', color: 'cyan', rgb: '0, 255, 255'},
              {
                value: minutes,
                label: 'MINS',
                color: 'lime',
                rgb: '200, 255, 0',
              },
              {
                value: seconds,
                label: 'SECS',
                color: 'orange',
                rgb: '255, 165, 0',
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className="relative group opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${(index + 2) * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Neon border */}
                <div
                  className={`absolute -inset-[1px] bg-${item.color}-500 rounded-lg opacity-75 blur-sm group-hover:opacity-100 transition-opacity`}
                  style={{
                    boxShadow: `0 0 30px rgba(${item.rgb}, 0.5)`,
                  }}
                />

                {/* Digital display */}
                <div className="relative bg-black border border-gray-800 rounded-lg p-4 md:p-6 min-w-[90px] md:min-w-[110px]">
                  <div
                    className={`text-3xl md:text-5xl font-bold font-mono text-${item.color}-400 text-center`}
                    style={{
                      textShadow: `0 0 20px rgba(${item.rgb}, 0.8)`,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    className={`text-[10px] md:text-xs text-${item.color}-500/70 text-center mt-1 font-mono tracking-wider`}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-black animate-pulse">
              <span className="text-transparent bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text">
                [ SYSTEM ONLINE ]
              </span>
            </h2>
          </div>
        )}

        {/* Email Signup - Neon Style */}
        <div
          className="w-full max-w-lg mb-12 opacity-0 animate-fade-in"
          style={{
            animationDelay: '0.6s',
            animationFillMode: 'forwards',
          }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              {/* Neon border glow */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-lg opacity-75 blur-sm"></div>

              <div className="relative flex flex-col sm:flex-row gap-3 bg-black rounded-lg p-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER.EMAIL@SYSTEM"
                  className="flex-1 px-4 py-3 bg-black text-cyan-400 placeholder-gray-600 font-mono focus:outline-none focus:text-lime-400 transition-colors rounded-md"
                  disabled={isSubmitting || isSubmitted}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`
                    px-6 py-3 rounded-md font-mono font-bold transition-all duration-300 relative overflow-hidden uppercase tracking-wider
                    ${
                      isSubmitted
                        ? 'bg-lime-500 text-black'
                        : isSubmitting
                          ? 'bg-gray-900 text-gray-500 cursor-wait'
                          : 'bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white hover:from-fuchsia-500 hover:to-cyan-500'
                    }
                  `}
                  style={{
                    boxShadow:
                      !isSubmitted && !isSubmitting
                        ? '0 0 30px rgba(255, 0, 255, 0.5)'
                        : '',
                  }}
                >
                  <span className="relative z-10">
                    {isSubmitted ? '[OK]' : isSubmitting ? '...' : 'CONNECT'}
                  </span>
                </button>
              </div>
            </div>
            {isSubmitted && (
              <p className="text-lime-400 text-sm mt-4 text-center font-mono animate-pulse">
                [SUCCESS] EMAIL.REGISTERED
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div
          className="text-gray-600 text-xs font-mono tracking-wider opacity-0 animate-fade-in"
          style={{
            animationDelay: '0.8s',
            animationFillMode: 'forwards',
          }}
        >
          <span className="text-fuchsia-500/50">©</span> 2025 {brandName}{' '}
          <span className="text-cyan-500/50">|</span> SYSTEM.PROTECTED
        </div>
      </div>
    </div>
  );
};

export default NeonComingSoon;
