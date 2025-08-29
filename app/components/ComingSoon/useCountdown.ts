import {useState, useEffect, useCallback} from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface UseCountdownProps {
  targetDate: string | Date;
  onComplete?: () => void;
}

const calculateTimeLeft = (targetDate: string | Date): TimeLeft => {
  const difference = +new Date(targetDate) - +new Date();

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  };
};

export const useCountdown = ({targetDate, onComplete}: UseCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate),
  );
  const [isComplete, setIsComplete] = useState(false);

  const updateCountdown = useCallback(() => {
    const newTimeLeft = calculateTimeLeft(targetDate);
    setTimeLeft(newTimeLeft);

    if (newTimeLeft.total <= 0 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [targetDate, isComplete, onComplete]);

  useEffect(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [updateCountdown]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return {
    days: formatNumber(timeLeft.days),
    hours: formatNumber(timeLeft.hours),
    minutes: formatNumber(timeLeft.minutes),
    seconds: formatNumber(timeLeft.seconds),
    daysNumeric: timeLeft.days,
    hoursNumeric: timeLeft.hours,
    minutesNumeric: timeLeft.minutes,
    secondsNumeric: timeLeft.seconds,
    isComplete,
  };
};

export default useCountdown;
