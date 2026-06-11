const BAD_WORDS = [
  // Vietnamese
  "địt", "đụ", "lồn", "cặc", "buồi", "đĩ", "điếm", "ngu", "chó", "khốn",
  "mẹ kiếp", "đéo", "vãi", "cứt", "đít", "đồ chó", "thằng chó",
  "con đĩ", "đồ điên", "mày chết", "tao giết",
  // English
  "fuck", "shit", "bitch", "asshole", "bastard", "damn", "crap",
  "idiot", "stupid", "moron", "dick", "cock", "pussy", "whore",
];

export function filterProfanity(text: string): string {
  let result = text;
  for (const word of BAD_WORDS) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "gi"), "***");
  }
  return result;
}
