/** Tamil first, English one tap away. Every interface word lives here. */
export type Lang = "ta" | "en";
const T = {
  ta: { brand: "நாமக்கல்", tagline: "நம்ம ஊரு அப்டேட்", search: "செய்தி அல்லது ஊர் தேடுங்கள்", all: "அனைத்தும்", allOf: "முழு",
        district: "நாமக்கல் மாவட்டம்", distSub: "8 தாலுகாக்கள் · அனைத்து ஊர் செய்திகள்", latest: "சமீபத்திய செய்திகள்", stories: "செய்திகள்",
        showAll: "அனைத்தும் காட்டு", empty: "இந்தத் தேர்வில் செய்தி இல்லை.", anyDay: "எல்லா நாளும்", today: "இன்று", yesterday: "நேற்று",
        week: "இந்த வாரம்", pick: "தேதி தேர்வு", power: "மின்தடை அறிவிப்பு", place: "இடம்", details: "முழு விவரம்", share: "WhatsApp-ல் பகிர்",
        reel: "ரீல் பார்க்க", back: "செய்திகள்", mine: "என் பகுதி", setMine: "என் பகுதியாக வை", more: "மேலும் செய்திகள்",
        about: "நாமக்கல் மாவட்டத்தின் அனைத்து ஊர் செய்திகளும் - தமிழிலும் ஆங்கிலத்திலும்.", source: "மூலச் செய்தி", tamilOnly: "(இந்தச் செய்தி தமிழில் மட்டும்)" },
  en: { brand: "Namakkal", tagline: "Our town, updated", search: "Search news or town", all: "All", allOf: "All of",
        district: "Namakkal District", distSub: "8 taluks · news from every town", latest: "Latest news", stories: "stories",
        showAll: "Show all", empty: "No news for this choice.", anyDay: "Any day", today: "Today", yesterday: "Yesterday",
        week: "This week", pick: "Pick a date", power: "Power cut notice", place: "Place", details: "Full details", share: "Share on WhatsApp",
        reel: "Watch reel", back: "News", mine: "My area", setMine: "Set as my area", more: "More news",
        about: "News from every town in Namakkal district - in Tamil and English.", source: "Source", tamilOnly: "(This story is in Tamil only)" },
};
export type Key = keyof typeof T.ta;
export const tr = (lang: Lang, k: Key) => T[lang][k];
export const langOf = (v: string | null | undefined): Lang => (v === "en" ? "en" : "ta");
