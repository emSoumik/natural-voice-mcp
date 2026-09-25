#!/usr/bin/env python3
"""Mechanical lint for the natural-voice skill.

Usage:
    python3 check.py --register default draft.txt
    pbpaste | python3 check.py --register pro

Registers: text, default, broadcast, pro, formal.
Exit code 0 when clean, 1 when something was flagged. Output is hints, not law.
"""

import argparse
import re
import sys

LOWERCASE_REGISTERS = {"text", "default", "broadcast"}
BOLD_LIMIT = {"text": 0, "default": 4, "broadcast": 2, "pro": 0, "formal": 4}

AI_WORDS = [
    "delve", "tapestry", "testament", "underscore", "underscores", "foster",
    "fostering", "garner", "intricate", "interplay", "pivotal", "crucial",
    "landscape", "realm", "embark", "elevate", "empower", "unlock", "harness",
    "leverage", "leveraging", "utilize", "utilizing", "seamless", "seamlessly",
    "robust", "additionally", "furthermore", "moreover", "showcase",
    "showcasing", "synergy", "streamline", "cutting-edge", "cutting edge",
    "groundbreaking", "game changer", "game-changer", "vibrant", "facilitate",
    "learnings", "upskill", "impactful", "transformative", "thrilled", "humbled",
]

BANNED_PHRASES = [
    "at the end of the day", "it's important to note", "it is important to note",
    "it's worth noting", "it goes without saying", "that being said",
    "having said that", "in terms of", "when it comes to", "in order to",
    "due to the fact that", "fast-paced world", "fast paced world",
    "the power of", "a testament to", "plays a crucial role", "the future is bright",
    "this is just the beginning", "let that sink in", "here's the thing",
    "the best part?", "excited to share", "excited to announce", "stay tuned",
    "hope this email finds you well", "i am writing to express",
    "do not hesitate", "don't hesitate", "in conclusion", "serves as", "stands as",
]

CHAT_RESIDUE = [
    "here's a rewrite", "here is a rewrite", "here's your", "i hope this helps",
    "hope this helps", "let me know if you'd like", "let me know if you want",
    "want me to", "would you like me to", "feel free to adjust", "great question",
    "certainly!", "you're absolutely right", "as of my last",
]

NOT_JUST_SLOGAN = re.compile(r"\b(it'?s|this is|this isn'?t)\s+not\s+(just|only|merely|about)\b.*?[.,;]\s*(it'?s|this is)\b", re.I)
NOT_ONLY_BUT = re.compile(r"\bnot only\b.*?\bbut( also)?\b", re.I | re.S)
HYPHEN_PAIRS = re.compile(r"\b(third-party|cross-functional|client-facing|data-driven|decision-making|well-known|high-quality|real-time|long-term|short-term|end-to-end|detail-oriented|results-driven|fast-paced)\b", re.I)
SENTENCE_START_CAP = re.compile(r"(?:^|[.!?]\s+|\n\s*)([A-Z][a-z]+)\b")
CAPITAL_I = re.compile(r"(?<![A-Za-z])I(?:'(?:m|ve|d|ll))?(?![A-Za-z])")


def find_words(text, words):
    hits = []
    low = text.lower()
    for w in words:
        pattern = r"(?<![a-z])" + re.escape(w.lower()) + r"(?![a-z])"
        n = len(re.findall(pattern, low))
        if n:
            hits.append(f"{w} x{n}" if n > 1 else w)
    return hits


def check(text, register):
    issues = []
    prose = re.sub(r"```.*?```|`[^`]*`|https?://\S+|\[[^\]]*\]\([^)]*\)", " ", text, flags=re.S)

    if re.search(r"[—–]", prose):
        issues.append("em/en dash found. use a comma, period, colon, or new line.")
    if re.search(r"\s--\s|\w--\w|\s-\s", prose):
        issues.append("'--' or ' - ' used as punctuation. replace with a comma or period.")
    if re.search(r"[“”‘’]", prose):
        issues.append("curly quotes found. use straight quotes.")

    if hits := find_words(prose, AI_WORDS):
        issues.append("ai vocabulary: " + ", ".join(hits))
    if hits := find_words(prose, BANNED_PHRASES):
        issues.append("banned phrases: " + ", ".join(hits))
    if hits := find_words(prose, CHAT_RESIDUE):
        issues.append("chat residue: " + ", ".join(hits))

    if NOT_JUST_SLOGAN.search(prose) or NOT_ONLY_BUT.search(prose):
        issues.append("negative parallelism ('it's not X, it's Y' / 'not only... but').")
    if hits := sorted({m.group(0).lower() for m in HYPHEN_PAIRS.finditer(prose)}):
        issues.append("uniform hyphenation, drop the hyphen: " + ", ".join(hits))

    g = len(re.findall(r"\bgenuinely\b", prose, re.I))
    if g > 1:
        issues.append(f"'genuinely' used {g} times. budget is 1.")
    fillers = len(re.findall(r"\b(really|super|honestly|truly|literally|basically)\b", prose, re.I))
    if fillers > 1:
        issues.append(f"{fillers} intensifiers (really/super/honestly/truly/literally/basically). keep 1 max.")

    bold = len(re.findall(r"\*\*[^*]+\*\*", text))
    if bold > BOLD_LIMIT[register]:
        issues.append(f"{bold} bold spans. limit for '{register}' is {BOLD_LIMIT[register]}.")
    if re.search(r"^\s*[-*]\s+\*\*[^*]+:\*\*", text, re.M) or re.search(r"^\s*[-*]\s+\*\*[^*]+\*\*:", text, re.M):
        issues.append("bold-label bullet list. turn it into sentences.")

    emoji = re.findall(r"[\U0001F300-\U0001FAFF☀-➿]", text)
    if emoji and register != "broadcast":
        issues.append(f"{len(emoji)} emoji. none for '{register}'.")
    elif len(emoji) > 3:
        issues.append(f"{len(emoji)} emoji. max 3 in broadcast.")

    if register in LOWERCASE_REGISTERS:
        caps = sorted({m.group(1) for m in SENTENCE_START_CAP.finditer(prose)})
        if caps:
            issues.append("capitalized sentence starts (lowercase register): " + ", ".join(caps[:8]))
        if CAPITAL_I.search(prose):
            issues.append("capital 'I' found. use 'i' in this register.")
    else:
        if re.search(r"(?<![A-Za-z'])i(?:'(?:m|ve|d|ll))?(?![A-Za-z'])", prose):
            issues.append("lowercase 'i' in a capitalized register.")

    if register in {"pro", "formal"}:
        if n := len(re.findall(r"!", prose)):
            if n > 1:
                issues.append(f"{n} exclamation marks. keep it to 1 at most.")
        slang = find_words(prose, ["wanna", "gonna", "pls", "dw", "ty", "btw", "haha", "lol", "tldr", "<3"])
        if slang:
            issues.append("casual markers in a pro register: " + ", ".join(slang))

    sentences = [s for s in re.split(r"[.!?\n]+", prose) if s.strip()]
    tiny = [s for s in sentences if len(s.split()) <= 4]
    if register != "text" and register != "broadcast" and len(sentences) >= 5 and len(tiny) / len(sentences) > 0.4:
        issues.append(f"{len(tiny)}/{len(sentences)} sentences are 4 words or fewer. reads staccato, add comma rhythm.")

    last = text.strip().splitlines()[-1].strip().lower() if text.strip() else ""
    if last.endswith("?") and any(k in last for k in ("want me", "should i", "does that", "anything else", "thoughts")):
        issues.append("ends with a chatbot style follow up question.")

    return issues


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", nargs="?", help="text file to check (default: stdin)")
    ap.add_argument("--register", "-r", default="default", choices=["text", "default", "broadcast", "pro", "formal"])
    args = ap.parse_args()

    text = open(args.file, encoding="utf-8").read() if args.file else sys.stdin.read()
    issues = check(text, args.register)
    if not issues:
        print(f"clean ({args.register})")
        return 0
    print(f"{len(issues)} flag(s) for register '{args.register}':")
    for i in issues:
        print(f"  - {i}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
