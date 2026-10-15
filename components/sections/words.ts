const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/** Small counts as words, the way a sentence would say them. */
export const numberWord = (n: number) => WORDS[n] ?? String(n);
