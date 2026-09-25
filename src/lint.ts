export type Register = 'text' | 'default' | 'broadcast' | 'pro' | 'formal';

const lowercaseRegisters = new Set<Register>(['text', 'default', 'broadcast']);
const boldLimit: Record<Register, number> = { text: 0, default: 4, broadcast: 2, pro: 0, formal: 4 };
const aiWordList = [
  'delve', 'tapestry', 'testament', 'underscore', 'underscores', 'foster', 'fostering', 'garner', 'intricate', 'interplay', 'pivotal', 'crucial', 'landscape', 'realm', 'embark', 'elevate', 'empower', 'unlock', 'harness', 'leverage', 'leveraging', 'utilize', 'utilizing', 'seamless', 'seamlessly', 'robust', 'additionally', 'furthermore', 'moreover', 'showcase', 'showcasing', 'synergy', 'streamline', 'cutting-edge', 'cutting edge', 'groundbreaking', 'game changer', 'game-changer', 'vibrant', 'facilitate', 'learnings', 'upskill', 'impactful', 'transformative', 'thrilled', 'humbled',
];
const bannedPhrases = [
  'at the end of the day', "it's important to note", 'it is important to note', "it's worth noting", 'it goes without saying', 'that being said', 'having said that', 'in terms of', 'when it comes to', 'in order to', 'due to the fact that', 'fast-paced world', 'fast paced world', 'the power of', 'a testament to', 'plays a crucial role', 'the future is bright', 'this is just the beginning', 'let that sink in', "here's the thing", 'the best part?', 'excited to share', 'excited to announce', 'stay tuned', 'hope this email finds you well', 'i am writing to express', 'do not hesitate', "don't hesitate", 'in conclusion', 'serves as', 'stands as',
];
const chatResidue = [
  "here's a rewrite", 'here is a rewrite', "here's your", 'i hope this helps', 'hope this helps', "let me know if you'd like", 'let me know if you want', 'want me to', 'would you like me to', 'feel free to adjust', 'great question', 'certainly!', "you're absolutely right", 'as of my last',
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findWords(text: string, words: string[]): string[] {
  return words.flatMap((word) => {
    const count = [...text.matchAll(new RegExp(`(?<![a-z])${escapeRegExp(word)}(?![a-z])`, 'gi'))].length;
    return count ? [`${word}${count > 1 ? ` x${count}` : ''}`] : [];
  });
}

export function lintVoice(text: string, register: Register): string[] {
  const issues: string[] = [];
  const prose = text.replace(/```[\s\S]*?```|`[^`]*`|https?:\/\/\S+|\[[^\]]*\]\([^)]*\)/g, ' ');
  if (/[—–]/.test(prose)) issues.push('em/en dash found. use a comma, period, colon, or new line.');
  if (/\s--\s|\w--\w|\s-\s/.test(prose)) issues.push("'--' or ' - ' used as punctuation. replace with a comma or period.");
  if (/[“”‘’]/.test(prose)) issues.push('curly quotes found. use straight quotes.');
  for (const [label, words] of [['ai vocabulary', aiWordList], ['banned phrases', bannedPhrases], ['chat residue', chatResidue]] as const) {
    const hits = findWords(prose, words);
    if (hits.length) issues.push(`${label}: ${hits.join(', ')}`);
  }
  if (/\b(it'?s|this is|this isn'?t)\s+not\s+(just|only|merely|about)\b.*?[.,;]\s*(it'?s|this is)\b/i.test(prose) || /\bnot only\b[\s\S]*?\bbut( also)?\b/i.test(prose)) {
    issues.push("negative parallelism ('it's not X, it's Y' / 'not only... but').");
  }
  const hyphens = [...new Set([...prose.matchAll(/\b(third-party|cross-functional|client-facing|data-driven|decision-making|well-known|high-quality|real-time|long-term|short-term|end-to-end|detail-oriented|results-driven|fast-paced)\b/gi)].map((match) => match[0].toLowerCase()))].sort();
  if (hyphens.length) issues.push(`uniform hyphenation, drop the hyphen: ${hyphens.join(', ')}`);
  const genuinely = [...prose.matchAll(/\bgenuinely\b/gi)].length;
  if (genuinely > 1) issues.push(`'genuinely' used ${genuinely} times. budget is 1.`);
  const fillers = [...prose.matchAll(/\b(really|super|honestly|truly|literally|basically)\b/gi)].length;
  if (fillers > 1) issues.push(`${fillers} intensifiers (really/super/honestly/truly/literally/basically). keep 1 max.`);
  const bold = [...text.matchAll(/\*\*[^*]+\*\*/g)].length;
  if (bold > boldLimit[register]) issues.push(`${bold} bold spans. limit for '${register}' is ${boldLimit[register]}.`);
  if (/^\s*[-*]\s+\*\*[^*]+:\*\*|^\s*[-*]\s+\*\*[^*]+\*\*:/m.test(text)) issues.push('bold-label bullet list. turn it into sentences.');
  const emoji = [...text.matchAll(/[\u{1F300}-\u{1FAFF}☀-➿]/gu)].length;
  if (emoji && register !== 'broadcast') issues.push(`${emoji} emoji. none for '${register}'.`);
  else if (emoji > 3) issues.push(`${emoji} emoji. max 3 in broadcast.`);
  if (lowercaseRegisters.has(register)) {
    const caps = [...new Set([...prose.matchAll(/(?:^|[.!?]\s+|\n\s*)([A-Z][a-z]+)\b/g)].map((match) => match[1]))].sort();
    if (caps.length) issues.push(`capitalized sentence starts (lowercase register): ${caps.slice(0, 8).join(', ')}`);
    if (/(?<![A-Za-z])I(?:'(?:m|ve|d|ll))?(?![A-Za-z])/.test(prose)) issues.push("capital 'I' found. use 'i' in this register.");
  } else {
    if (/(?<![A-Za-z'])i(?:'(?:m|ve|d|ll))?(?![A-Za-z'])/.test(prose)) issues.push("lowercase 'i' in a capitalized register.");
    const exclamations = [...prose.matchAll(/!/g)].length;
    if (exclamations > 1) issues.push(`${exclamations} exclamation marks. keep it to 1 at most.`);
    const slang = findWords(prose, ['wanna', 'gonna', 'pls', 'dw', 'ty', 'btw', 'haha', 'lol', 'tldr', '<3']);
    if (slang.length) issues.push(`casual markers in a pro register: ${slang.join(', ')}`);
  }
  const sentences = prose.split(/[.!?\n]+/).filter((sentence) => sentence.trim());
  const tiny = sentences.filter((sentence) => sentence.trim().split(/\s+/).length <= 4);
  if (!['text', 'broadcast'].includes(register) && sentences.length >= 5 && tiny.length / sentences.length > 0.4) {
    issues.push(`${tiny.length}/${sentences.length} sentences are 4 words or fewer. reads staccato, add comma rhythm.`);
  }
  const last = text.trim().split('\n').at(-1)?.trim().toLowerCase() ?? '';
  if (last.endsWith('?') && ['want me', 'should i', 'does that', 'anything else', 'thoughts'].some((part) => last.includes(part))) issues.push('ends with a chatbot style follow up question.');
  return issues;
}
