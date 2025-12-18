export function nodeIdFromIndex(index: number): string {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error('index must be >= 0');
  }

  let n = index;
  let letters = '';

  do {
    const rem = n % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);

  return `node${letters}`;
}
