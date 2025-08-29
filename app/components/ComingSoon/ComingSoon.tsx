import React, {useState, useEffect} from 'react';
import {useCountdown} from './useCountdown';
import GlitchText from './GlitchText';

interface ComingSoonProps {
  launchDate?: Date | string;
  logoPath?: string;
  brandName?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  logoPath = 'https://cdn.shopify.com/s/files/1/0766/6532/3746/files/BR0KEFACE0_0.png',
  brandName = 'f4rmula',
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

        {/* f4rmula Glitch Text Effect */}
        <GlitchText
          text="f4rmula"
          textClassName="text-3xl md:text-5xl lg:text-6xl"
        />

        {/* COMING SOON Glitch Text Effect */}
        <GlitchText
          text="COMING SOON"
          className="mb-4"
          textClassName="text-5xl md:text-7xl lg:text-8xl"
        />

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
              WE&apos;RE LIVE!
            </h2>
          </div>
        )}

        {/* Email Signup */}
        {/*<div
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
                Thanks! We will notify you when we launch.
              </p>
            )}
          </form>
        </div>*/}

        {/* Footer */}
        <div
          className="text-gray-600 text-sm animate-fade-in-up"
          style={{animationDelay: '900ms'}}
        >
          © 2025 {brandName}. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
