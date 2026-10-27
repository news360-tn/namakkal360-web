/** News types shown on the site, each with its own colour (Tailwind theme colour names). */
export type TypeId = "power" | "collector" | "accident" | "crime" | "rain" | "civic" | "edu" | "event" | "business";
/** Tailwind needs full class names written out, so each type lists its own classes. */
export interface NewsType { id: TypeId; ta: string; en: string; text: string; bg: string; soft: string; line: string; ring: string }

export const TYPES: NewsType[] = [
  { id: "power", ta: "மின்தடை", en: "Power cut", text: "text-t-power", bg: "bg-t-power", soft: "bg-t-power/15", line: "border-t-t-power", ring: "shadow-t-power/40" },
  { id: "collector", ta: "அரசு அறிவிப்பு", en: "Govt notice", text: "text-t-collector", bg: "bg-t-collector", soft: "bg-t-collector/15", line: "border-t-t-collector", ring: "shadow-t-collector/40" },
  { id: "accident", ta: "விபத்து", en: "Accident", text: "text-t-accident", bg: "bg-t-accident", soft: "bg-t-accident/15", line: "border-t-t-accident", ring: "shadow-t-accident/40" },
  { id: "crime", ta: "குற்றம்", en: "Crime", text: "text-t-crime", bg: "bg-t-crime", soft: "bg-t-crime/15", line: "border-t-t-crime", ring: "shadow-t-crime/40" },
  { id: "rain", ta: "மழை / விவசாயம்", en: "Rain & Farming", text: "text-t-rain", bg: "bg-t-rain", soft: "bg-t-rain/15", line: "border-t-t-rain", ring: "shadow-t-rain/40" },
  { id: "civic", ta: "மக்கள் பிரச்னை", en: "Civic", text: "text-t-civic", bg: "bg-t-civic", soft: "bg-t-civic/15", line: "border-t-t-civic", ring: "shadow-t-civic/40" },
  { id: "edu", ta: "கல்வி", en: "Education", text: "text-t-edu", bg: "bg-t-edu", soft: "bg-t-edu/15", line: "border-t-t-edu", ring: "shadow-t-edu/40" },
  { id: "event", ta: "நிகழ்ச்சி", en: "Events", text: "text-t-event", bg: "bg-t-event", soft: "bg-t-event/15", line: "border-t-t-event", ring: "shadow-t-event/40" },
  { id: "business", ta: "வணிகம் / விலை", en: "Business & Prices", text: "text-t-business", bg: "bg-t-business", soft: "bg-t-business/15", line: "border-t-t-business", ring: "shadow-t-business/40" },
];
export const typeOf = (id: string) => TYPES.find((t) => t.id === id) ?? TYPES[5];

/** pipeline category (English, or மின் தடை) + headline -> site type */
export function typeFromCategory(category: string, headline = ""): TypeId {
  const c = `${category} ${headline}`.toLowerCase();
  if (/மின்\s*தடை|மின்தடை|power\s*(cut|shut)/.test(c)) return "power";
  if (/விபத்து|மோதி|accident|collision/.test(c)) return "accident";
  if (/crime|safety|கைது|திருட|கொலை/.test(c)) return "crime";
  if (/weather|agri|மழை|rain|விவசா/.test(c)) return "rain";
  if (/education|school|கல்வி|பள்ளி|exam/.test(c)) return "edu";
  if (/temple|event|festival|நிகழ்ச்சி|கோவில்|விழா/.test(c)) return "event";
  if (/business|price|விலை|market/.test(c)) return "business";
  if (/government|service|health|collector|ஆட்சியர்|கலெக்டர்|முகாம்/.test(c)) return "collector";
  return "civic";
}
