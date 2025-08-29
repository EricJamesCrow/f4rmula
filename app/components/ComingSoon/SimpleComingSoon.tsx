import React, {useState} from 'react';
import {useCountdown} from './useCountdown';

interface SimpleComingSoonProps {
  launchDate?: Date | string;
  logoPath?: string;
  brandName?: string;
}

const SimpleComingSoon: React.FC<SimpleComingSoonProps> = ({
  launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  logoPath = 'https://cdn.shopify.com/s/files/1/0766/6532/3746/files/BR0KEFACE0_0.png',
  brandName = 'F4RMULA',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const {days, hours, minutes, seconds, isComplete} = useCountdown({
    targetDate: launchDate,
    onComplete: () => {
      // Launch time callback
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with your actual API endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setEmail('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-12">
          <img
            src={logoPath}
            alt={brandName}
            className="w-32 h-32 md:w-40 md:h-40 mx-auto object-contain"
            onError={(e) => {
              // Fallback to text if logo doesn't load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <h1 className="text-5xl md:text-7xl font-bold mt-8 tracking-tight">
            {brandName}
          </h1>
        </div>

        {/* Coming Soon Text */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-300 mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We&apos;re working on something special. Be the first to know when
            we launch.
          </p>
        </div>

        {/* Countdown Timer */}
        {!isComplete ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            {[
              {value: days, label: 'Days'},
              {value: hours, label: 'Hours'},
              {value: minutes, label: 'Minutes'},
              {value: seconds, label: 'Seconds'},
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
              >
                <div className="text-3xl md:text-4xl font-bold font-mono">
                  {item.value}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              We&apos;re Live! 🎉
            </h2>
          </div>
        )}

        {/* Email Signup */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isSubmitted
                    ? 'bg-green-600 text-white'
                    : isSubmitting
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {isSubmitted
                  ? '✓ Subscribed'
                  : isSubmitting
                    ? 'Sending...'
                    : 'Notify Me'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {isSubmitted && (
              <p className="text-green-400 text-sm">
                Thanks! We&apos;ll notify you when we launch.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleComingSoon;
