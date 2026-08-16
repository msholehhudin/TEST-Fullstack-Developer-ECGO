const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/**
 * "2 minutes ago", "3 hours ago", "1 day ago", "Never".
 * `now` is injectable for deterministic testing.
 */
export function formatHeartbeatRelative(
  timestamp: string | null,
  now: Date = new Date()
): string {
  if (!timestamp) return "Never";

  const then = new Date(timestamp);
  if (Number.isNaN(then.getTime())) return "Never";

  const diffSeconds = Math.max(
    0,
    Math.floor((now.getTime() - then.getTime()) / 1000)
  );

  if (diffSeconds < 5) return "Just now";
  if (diffSeconds < MINUTE) return `${diffSeconds} seconds ago`;

  if (diffSeconds < HOUR) {
    const minutes = Math.floor(diffSeconds / MINUTE);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (diffSeconds < DAY) {
    const hours = Math.floor(diffSeconds / HOUR);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(diffSeconds / DAY);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

/** "Aug 16, 2026, 08:31 PM" — used as the tooltip's exact timestamp. */
export function formatHeartbeatExact(timestamp: string | null): string {
  if (!timestamp) return "No heartbeat recorded";

  const then = new Date(timestamp);
  if (Number.isNaN(then.getTime())) return "No heartbeat recorded";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(then);
}
