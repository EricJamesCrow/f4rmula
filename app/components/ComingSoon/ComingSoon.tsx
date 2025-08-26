import React, {useState, useEffect} from 'react';
import useCountdown from './useCountdown';

interface ComingSoonProps {
  launchDate?: Date | string;
  logoPath?: string;
  brandName?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  logoPath = '/logos/BR0KEFACE0_0+.png',
  brandName = 'F4RMULA',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const {days, hours, minutes, seconds, isComplete} = useCountdown({
    targetDate: launchDate,
    onComplete: () => console.log('Launch time!'),
  });

  useEffect(() => {
    setIsLoaded(true);
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
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black"></div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Logo */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <img
            src={logoPath}
            alt={brandName}
            className="relative w-32 h-32 md:w-48 md:h-48 object-contain transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Glitch Text Effect */}
        <div className="relative mb-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-wider text-center relative">
            <span className="relative inline-block animate-glitch">
              COMING SOON
              <span
                className="absolute top-0 left-0 text-cyan-400 opacity-70 animate-glitch-1"
                aria-hidden="true"
              >
                COMING SOON
              </span>
              <span
                className="absolute top-0 left-0 text-pink-400 opacity-70 animate-glitch-2"
                aria-hidden="true"
              >
                COMING SOON
              </span>
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-lg md:text-xl mb-12 text-center animate-fade-in-up animation-delay-200">
          Something big is dropping...
        </p>

        {/* Countdown Timer */}
        {!isComplete ? (
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {[
              {value: days, label: 'Days'},
              {value: hours, label: 'Hours'},
              {value: minutes, label: 'Minutes'},
              {value: seconds, label: 'Seconds'},
            ].map((item, index) => (
              <div
                key={item.label}
                className="relative group animate-fade-in-up"
                style={{animationDelay: `${(index + 3) * 100}ms`}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur-lg opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                  <div className="text-3xl md:text-5xl font-bold text-white text-center font-mono">
                    {item.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 text-center mt-1 uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              WE'RE LIVE!
            </h2>
          </div>
        )}

        {/* Email Signup */}
        <div
          className="w-full max-w-md mb-12 animate-fade-in-up"
          style={{animationDelay: '700ms'}}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                disabled={isSubmitting || isSubmitted}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group
                  ${
                    isSubmitted
                      ? 'bg-green-500 text-white'
                      : isSubmitting
                        ? 'bg-gray-800 text-gray-400 cursor-wait'
                        : 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105'
                  }
                `}
              >
                <span className="relative z-10">
                  {isSubmitted
                    ? '✓ Success'
                    : isSubmitting
                      ? 'Sending...'
                      : 'Get Notified'}
                </span>
                {!isSubmitted && !isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
            </div>
            {isSubmitted && (
              <p className="text-green-400 text-sm mt-3 text-center animate-fade-in">
                Thanks! We'll notify you when we launch.
              </p>
            )}
          </form>
        </div>

        {/* Social Links */}
        <div
          className="flex gap-6 mb-8 animate-fade-in-up"
          style={{animationDelay: '800ms'}}
        >
          {[
            {
              label: 'Instagram',
              path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z',
            },
            {
              label: 'Twitter',
              path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
            },
            {
              label: 'TikTok',
              path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
            },
          ].map((social) => (
            <a
              key={social.label}
              href="#"
              className="group relative"
              aria-label={social.label}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
              <svg
                className="relative w-6 h-6 text-gray-400 group-hover:text-white transition-colors transform group-hover:scale-110 duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d={social.path} />
              </svg>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div
          className="text-gray-600 text-sm animate-fade-in-up"
          style={{animationDelay: '900ms'}}
        >
          © 2024 {brandName}. All rights reserved.
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes glitch {
          0%,
          100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }

        @keyframes glitch-1 {
          0%,
          100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(20% 0 30% 0);
            transform: translate(-3px, 0);
          }
          40% {
            clip-path: inset(50% 0 20% 0);
            transform: translate(3px, 0);
          }
          60% {
            clip-path: inset(10% 0 60% 0);
            transform: translate(0, 2px);
          }
          80% {
            clip-path: inset(80% 0 5% 0);
            transform: translate(0, -2px);
          }
        }

        @keyframes glitch-2 {
          0%,
          100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
          }
          20% {
            clip-path: inset(60% 0 10% 0);
            transform: translate(2px, 0);
          }
          40% {
            clip-path: inset(20% 0 50% 0);
            transform: translate(-2px, 0);
          }
          60% {
            clip-path: inset(30% 0 40% 0);
            transform: translate(0, -2px);
          }
          80% {
            clip-path: inset(5% 0 80% 0);
            transform: translate(0, 2px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-glitch {
          animation: glitch 2s infinite;
        }

        .animate-glitch-1 {
          animation: glitch-1 2s infinite;
        }

        .animate-glitch-2 {
          animation: glitch-2 2s infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .bg-grid-white {
          background-image:
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            );
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
