/**
 * Typewriter quotes to typographer's quotes, for prose that came from
 * Markdown READMEs. Leaves primes after digits (5′, 3″) and anything already
 * curly alone.
 */
export function smart(text: string): string {
  return text
    .replace(/(^|[\s([{—–-])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/(^|[\s([{—–-])'/g, "$1‘")
    .replace(/'/g, "’");
}
