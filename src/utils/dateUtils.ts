export interface TimeRemaining {
  total: number; // total milliseconds
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function getTimeRemaining(targetDate: string): TimeRemaining {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const diff = target - now;
  const isPast = diff <= 0;
  const absDiff = Math.abs(diff);

  return {
    total: diff,
    days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((absDiff / (1000 * 60)) % 60),
    seconds: Math.floor((absDiff / 1000) % 60),
    isPast,
  };
}

export function getProgress(
  startDate: string | undefined,
  targetDate: string
): number {
  if (!startDate) return 0;

  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const target = new Date(targetDate).getTime();
  const totalDuration = target - start;

  if (totalDuration <= 0) return 1;

  const elapsed = now - start;
  const progress = elapsed / totalDuration;

  return Math.max(0, Math.min(1, progress));
}

export function formatCompactDuration(time: TimeRemaining): string {
  if (time.days > 0) {
    return `${time.days}d ${time.hours}h`;
  }
  if (time.hours > 0) {
    return `${time.hours}h ${time.minutes}m`;
  }
  return `${time.minutes}m ${time.seconds}s`;
}
