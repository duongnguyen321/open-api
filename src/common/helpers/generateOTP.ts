export default function generateOtp(): string {
  // Generate 4 distinct random single digits
  const digits: number[] = [];
  while (digits.length < 4) {
    const digit = Math.floor(Math.random() * 10);
    if (!digits.includes(digit)) {
      digits.push(digit);
    }
  }
  const [a, b, c, d] = digits;

  // Create at least 50 patterns using all 4 digits (a, b, c, d)
  // Each pattern is 6 digits long and uses all 4 unique digits
  const patterns = [
    // Simple sequence patterns
    `${a}${b}${c}${d}${a}${b}`,
    `${a}${b}${c}${d}${b}${c}`,
    `${a}${b}${c}${d}${c}${d}`,
    `${a}${b}${c}${d}${d}${a}`,
    `${b}${c}${d}${a}${b}${c}`,
    `${c}${d}${a}${b}${c}${d}`,
    `${d}${a}${b}${c}${d}${a}`,

    // Alternating patterns
    `${a}${b}${a}${c}${a}${d}`,
    `${b}${a}${b}${c}${b}${d}`,
    `${c}${a}${c}${b}${c}${d}`,
    `${d}${a}${d}${b}${d}${c}`,
    `${a}${b}${c}${a}${b}${d}`,
    `${a}${c}${d}${b}${c}${d}`,

    // Palindrome-like patterns
    `${a}${b}${c}${d}${c}${b}`,
    `${a}${b}${d}${c}${b}${a}`,
    `${b}${a}${c}${d}${a}${b}`,
    `${c}${d}${a}${b}${d}${c}`,

    // Paired patterns
    `${a}${a}${b}${c}${d}${d}`,
    `${a}${b}${b}${c}${d}${a}`,
    `${a}${b}${c}${c}${d}${a}`,
    `${a}${b}${c}${d}${d}${a}`,
    `${a}${a}${b}${b}${c}${d}`,
    `${a}${b}${b}${c}${c}${d}`,

    // Double-alternating patterns
    `${a}${b}${c}${b}${d}${a}`,
    `${a}${c}${b}${d}${a}${c}`,
    `${b}${d}${a}${c}${b}${d}`,
    `${c}${a}${d}${b}${c}${a}`,

    // Sandwiched patterns
    `${a}${b}${c}${c}${b}${d}`,
    `${a}${c}${b}${b}${c}${d}`,
    `${b}${a}${d}${d}${a}${c}`,
    `${b}${d}${c}${c}${d}${a}`,

    // Grouped patterns
    `${a}${a}${b}${c}${d}${c}`,
    `${b}${b}${c}${d}${a}${d}`,
    `${c}${c}${d}${a}${b}${a}`,
    `${d}${d}${a}${b}${c}${b}`,

    // Mixed patterns
    `${a}${c}${b}${d}${c}${a}`,
    `${b}${d}${a}${c}${d}${b}`,
    `${c}${a}${d}${b}${a}${c}`,
    `${d}${b}${c}${a}${b}${d}`,

    // Symmetrical patterns
    `${a}${b}${d}${d}${b}${c}`,
    `${b}${c}${a}${a}${c}${d}`,
    `${c}${d}${b}${b}${d}${a}`,
    `${d}${a}${c}${c}${a}${b}`,

    // More complex patterns
    `${a}${d}${b}${c}${a}${d}`,
    `${b}${a}${c}${d}${b}${a}`,
    `${c}${b}${d}${a}${c}${b}`,
    `${d}${c}${a}${b}${d}${c}`,
    `${a}${c}${d}${b}${a}${c}`,
    `${b}${d}${a}${c}${b}${d}`,
    `${c}${a}${b}${d}${c}${a}`,
    `${d}${b}${c}${a}${d}${b}`,

    // Additional patterns to reach 50+
    `${a}${b}${d}${a}${c}${d}`,
    `${a}${c}${b}${d}${a}${b}`,
    `${b}${d}${c}${a}${b}${c}`,
  ];

  // Select a random pattern
  return patterns[Math.floor(Math.random() * patterns.length)];
}
