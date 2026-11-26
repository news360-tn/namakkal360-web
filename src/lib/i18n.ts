/** Tamil first, English one tap away. Every interface word lives here. */
export type Lang = "ta" | "en";
const T = {
  ta: { lead: "முக்கிய செய்தி", readOriginal: "மூலச் செய்தியைப் படிக்க", watchOn: "இந்தச் செய்தியைப் பார்க்க", photo: "அசல் படம்", sketchNote: "படம்: செய்தியின் அசல் படம், பென்சில் ஓவியமாக", aboutNews: "இந்தச் செய்தி பற்றி", newsDate: "செய்தி தேதி", followUs: "எங்களைப் பின்தொடர", noSource: "மூல இணைப்பு இல்லை", sourceNote: "ஒவ்வொரு செய்தியும் அதன் மூலச் செய்தியின் பெயர், இணைப்புடன்.",
        brand: "நாமக்கல்", tagline: "நம்ம ஊரு அப்டேட்", search: "செய்தி அல்லது ஊர் தேடுங்கள்", all: "அனைத்தும்", allOf: "முழு",
        district: "நாமக்கல் மாவட்டம்", distSub: "8 தாலுகாக்கள் · அனைத்து ஊர் செய்திகள்", latest: "சமீபத்திய செய்திகள்", stories: "செய்திகள்",
        showAll: "அனைத்தும் காட்டு", empty: "இந்தத் தேர்வில் செய்தி இல்லை.", anyDay: "எல்லா நாளும்", today: "இன்று", yesterday: "நேற்று",
        week: "இந்த வாரம்", pick: "தேதி தேர்வு", power: "மின்தடை அறிவிப்பு", place: "இடம்", details: "முழு விவரம்", share: "WhatsApp-ல் பகிர்",
        reel: "ரீல் பார்க்க", back: "செய்திகள்", mine: "என் பகுதி", setMine: "என் பகுதியாக வை", more: "மேலும் செய்திகள்", page: "பக்கம்", area: "பகுதி", town: "ஊர்", kind: "வகை", day: "தேதி", prev: "முந்தைய", next: "அடுத்த",
        about: "நாமக்கல் மாவட்டத்தின் அனைத்து ஊர் செய்திகளும் - தமிழிலும் ஆங்கிலத்திலும்.", source: "மூலச் செய்தி", tamilOnly: "(இந்தச் செய்தி தமிழில் மட்டும்)",
        hubBrand: "News", hubTagline: "7 மாவட்ட ஊர் செய்திகள்", hubTitle: "7 மாவட்டங்கள் · ஒரே இடத்தில் ஊர் செய்திகள்",
        hubSub: "நாமக்கல், கோவை, சேலம், ஈரோடு, கரூர், திருப்பூர், திருச்சி - ஒவ்வொரு தாலுகா, ஒவ்வொரு ஊரின் செய்திகளும் தமிழிலும் ஆங்கிலத்திலும்.",
        allDistricts: "அனைத்து மாவட்டங்கள்", districtWord: "மாவட்டம்", districtNews: "மாவட்டச் செய்திகள்", taluks: "தாலுகாக்கள்", everyTown: "அனைத்து ஊர் செய்திகள்",
        aboutOne: "மாவட்டத்தின் அனைத்து ஊர் செய்திகளும் - தமிழிலும் ஆங்கிலத்திலும்.", hubAbout: "நாமக்கல், கோவை, சேலம், ஈரோடு, கரூர், திருப்பூர், திருச்சி மாவட்ட ஊர் செய்திகள் - தமிழிலும் ஆங்கிலத்திலும்." },
  en: { lead: "Top story", readOriginal: "Read the original report", watchOn: "Watch this news on", photo: "Original photo", sketchNote: "Picture: the news photo as a pencil sketch", aboutNews: "About this news", newsDate: "News date", followUs: "Follow us", noSource: "No source link", sourceNote: "Every story names its original source with a link.",
        brand: "Namakkal", tagline: "Our town, updated", search: "Search news or town", all: "All", allOf: "All of",
        district: "Namakkal District", distSub: "8 taluks · news from every town", latest: "Latest news", stories: "stories",
        showAll: "Show all", empty: "No news for this choice.", anyDay: "Any day", today: "Today", yesterday: "Yesterday",
        week: "This week", pick: "Pick a date", power: "Power cut notice", place: "Place", details: "Full details", share: "Share on WhatsApp",
        reel: "Watch reel", back: "News", mine: "My area", setMine: "Set as my area", more: "More news", page: "Page", area: "Area", town: "Town", kind: "Type", day: "Date", prev: "Previous", next: "Next",
        about: "News from every town in Namakkal district - in Tamil and English.", source: "Source", tamilOnly: "(This story is in Tamil only)",
        hubBrand: "News", hubTagline: "Local news, 7 districts", hubTitle: "7 districts · every town's news in one place",
        hubSub: "Namakkal, Coimbatore, Salem, Erode, Karur, Tirupur and Trichy - news from every taluk and town, in Tamil and English.",
        allDistricts: "All districts", districtWord: "District", districtNews: "district news", taluks: "taluks", everyTown: "news from every town",
        aboutOne: "district: news from every town - in Tamil and English.", hubAbout: "Local news from Namakkal, Coimbatore, Salem, Erode, Karur, Tirupur and Trichy districts - in Tamil and English." },
};
export type Key = keyof typeof T.ta;
export const tr = (lang: Lang, k: Key) => T[lang][k];
export const langOf = (v: string | null | undefined): Lang => (v === "en" ? "en" : "ta");
