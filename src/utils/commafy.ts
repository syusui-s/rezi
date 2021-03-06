/**
 * Separate number every three digit like 12,345
 *
 * @param num a number to be separated
 * @return string separated number
 */
const separateNumber = (num: number): string => {
  const s = num.toString();
  const segments = [];

  for (let i = 0; i < s.length; i += 3) {
    const start = Math.max(s.length - i - 3, 0);
    const end = Math.max(s.length - i, 0);
    segments.push(s.slice(start, end));
  }

  return segments.reverse().join(',');
};

export default separateNumber;
