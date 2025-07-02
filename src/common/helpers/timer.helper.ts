export default function timer(time: string): number {
  // Trim whitespace and convert to lowercase for easier parsing
  const trimmedTime = time.trim().toLowerCase();

  // Regular expression to match the number and unit
  const timePattern =
    /^(\d+)\s*(seconds?|second?|sec?|secs?|s?|minutes?|min?|mins?|m?|hours?|hour?|h?|days?|day?|d?|months?|month?|M?|years?|year?|y?)$/;
  const match = trimmedTime.match(timePattern);

  if (!match) {
    throw new Error('Invalid time format');
  }

  const quantity = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
    case 'sec':
    case 'secs':
    case 'second':
    case 'seconds':
      return quantity;
    case 'm':
    case 'min':
    case 'mins':
    case 'minute':
    case 'minutes':
      return quantity * 60;
    case 'h':
    case 'hour':
    case 'hours':
      return quantity * 60 * 60;
    case 'd':
    case 'day':
    case 'days':
      return quantity * 60 * 60 * 24;
    case 'M':
    case 'month':
    case 'months':
      return quantity * 60 * 60 * 24 * 30; // Approximation, considering a month as 30 days
    case 'y':
    case 'year':
    case 'years':
      return quantity * 60 * 60 * 24 * 365; // Approximation, considering a year as 365 days
    default:
      throw new Error('Invalid time unit');
  }
}
