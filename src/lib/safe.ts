/** owner 26 Nov ("safe content with the source, the same pattern as social media"): every story shows the same safe line as the
 *  page's own first comment on Instagram / Facebook / YouTube (poster/post.py COMMENT_PURPOSE - the Tamil words are the same).
 *  The pipeline sends the kind of news (comment_kind); older stories without it get a line chosen from their news type. */
import type { Lang } from "./i18n";

const LINES: Record<string, { ta: string; en: string }> = {
  other: { ta: "இந்த செய்தி பொதுமக்களின் தகவல் மற்றும் விழிப்புணர்வுக்காக மட்டுமே மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. உள்ளூர் செய்திகளை மக்களிடம் கொண்டு சேர்ப்பதே எங்கள் நோக்கம்.",
    en: "This news is shared only for public information and awareness, based on the original source. Our aim is to bring local news to the people." },
  death: { ta: "இந்த செய்தி பொதுமக்களின் விழிப்புணர்வுக்காக மட்டுமே மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. பாதிக்கப்பட்ட குடும்பத்தினரின் உணர்வுகளை நாங்கள் மதிக்கிறோம்.",
    en: "This news is shared only for public awareness, based on the original source. We respect the feelings of the families affected." },
  crime: { ta: "இந்த செய்தி மூல ஆதாரத்தின் அடிப்படையில் விழிப்புணர்வுக்காக மட்டுமே பகிரப்பட்டுள்ளது. நீதிமன்றத்தில் நிரூபிக்கப்படும் வரை குற்றம் சாட்டப்பட்டவர்கள் குற்றவாளிகள் அல்ல.",
    en: "This news is shared only for awareness, based on the original source. Those accused are not guilty until it is proved in court." },
  court: { ta: "இந்த செய்தி நீதிமன்றத் தீர்ப்பு குறித்து மூல ஆதாரத்தின் அடிப்படையில் விழிப்புணர்வுக்காக மட்டுமே பகிரப்பட்டுள்ளது. தீர்ப்பு, மேல்முறையீடு போன்ற தொடர் சட்ட நடைமுறைகளுக்கு உட்பட்டது.",
    en: "This news about a court verdict is shared only for awareness, based on the original source. The verdict is subject to appeal and further legal steps." },
  safety: { ta: "இந்த செய்தி மூல ஆதாரத்தின் அடிப்படையில் விழிப்புணர்வுக்காக மட்டுமே பகிரப்பட்டுள்ளது. இது தொடர்பான தகவல் தெரிந்தால் அருகிலுள்ள காவல் நிலையத்தைத் தொடர்புகொள்ளுங்கள்.",
    en: "This news is shared only for awareness, based on the original source. If you know anything about it, contact the nearest police station." },
  power_cut: { ta: "மின் தடை நேரமும் பகுதிகளும் மின்வாரிய அறிவிப்பின் அடிப்படையில் பகிரப்பட்டுள்ளன. பணிகளைப் பொறுத்து நேரம் மாறலாம், சந்தேகம் இருந்தால் உங்கள் பகுதி மின்வாரிய அலுவலகத்தைத் தொடர்புகொள்ளுங்கள்.",
    en: "The power cut times and areas are from the electricity board's notice. Times may change with the work - if in doubt, contact your area's electricity office." },
  politics: { ta: "இந்த செய்தி மூல ஆதாரத்தின் அடிப்படையில் தகவலுக்காக மட்டுமே பகிரப்பட்டுள்ளது. நாங்கள் எந்தக் கட்சிக்கும் ஆதரவாகவோ எதிராகவோ செயல்படவில்லை.",
    en: "This news is shared only for information, based on the original source. We do not support or oppose any party." },
  jobs: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. விண்ணப்பிக்கும் முன் தகுதி, கடைசி தேதியை அதிகாரப்பூர்வ அறிவிப்பில் சரிபாருங்கள். வேலை தருவதாகச் சொல்லிப் பணம் கேட்பவர்களிடம் எச்சரிக்கையாக இருங்கள்.",
    en: "This information is based on the original source. Check eligibility and the last date in the official notice before applying. Beware of anyone asking for money to give a job." },
  govt: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. தேதி, விண்ணப்பம் போன்ற விவரங்களை அதிகாரப்பூர்வ அறிவிப்பில் உறுதி செய்துகொள்ளுங்கள்.",
    en: "This information is based on the original source. Confirm dates and application details in the official notice." },
  admin: { ta: "இந்த செய்தி மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. உள்ளூர் நிர்வாகத் தகவல்களை மக்களிடம் கொண்டு சேர்ப்பதே எங்கள் நோக்கம்.",
    en: "This news is based on the original source. Our aim is to bring local administration news to the people." },
  education: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. மாணவர்களுக்கும் பெற்றோருக்கும் பயனுள்ள தகவல்களைக் கொண்டு சேர்ப்பதே எங்கள் நோக்கம்.",
    en: "This information is based on the original source. Our aim is to bring useful information to students and parents." },
  health: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் விழிப்புணர்வுக்காக மட்டுமே பகிரப்பட்டுள்ளது. மருத்துவ ஆலோசனைக்கு மருத்துவரை அணுகுங்கள்.",
    en: "This information is shared only for awareness, based on the original source. Please see a doctor for medical advice." },
  weather_agri: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. வானிலை, விவசாயம் தொடர்பான அதிகாரப்பூர்வ அறிவிப்புகளையும் கவனியுங்கள்.",
    en: "This information is based on the original source. Please also follow the official weather and farming notices." },
  business: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. விலை, சந்தை நிலவரங்கள் இடத்துக்கும் நேரத்துக்கும் ஏற்ப மாறலாம்.",
    en: "This information is based on the original source. Prices and market conditions can change with place and time." },
  civic: { ta: "இந்த செய்தி மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. மக்களின் பிரச்சினைகள் அதிகாரிகளின் கவனத்துக்குச் செல்வதே எங்கள் நோக்கம்.",
    en: "This news is based on the original source. Our aim is that people's problems reach the officials." },
  roads: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. பயணத்துக்கு முன் சமீபத்திய நிலவரத்தை உறுதி செய்துகொள்ளுங்கள்.",
    en: "This information is based on the original source. Check the latest situation before you travel." },
  events: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் பகிரப்பட்டுள்ளது. நம் ஊர் நிகழ்வுகளை மக்களிடம் கொண்டு சேர்ப்பதே எங்கள் நோக்கம்.",
    en: "This information is based on the original source. Our aim is to bring our town's events to the people." },
  wildlife: { ta: "இந்த தகவல் மூல ஆதாரத்தின் அடிப்படையில் விழிப்புணர்வுக்காக மட்டுமே பகிரப்பட்டுள்ளது. வனவிலங்குகள் நடமாட்டம் தெரிந்தால் வனத்துறைக்குத் தகவல் தெரிவியுங்கள்.",
    en: "This information is shared only for awareness, based on the original source. If you see wild animals moving about, inform the forest department." },
  fire: { ta: "இந்த செய்தி மூல ஆதாரத்தின் அடிப்படையில் விழிப்புணர்வுக்காக மட்டுமே பகிரப்பட்டுள்ளது. தீ விபத்து ஏற்பட்டால் உடனே 101 எண்ணை அழைக்கவும்.",
    en: "This news is shared only for awareness, based on the original source. In case of a fire, call 101 at once." },
};
const NOT_GUILTY = { ta: "நீதிமன்றத்தில் நிரூபிக்கப்படும் வரை குற்றம் சாட்டப்பட்டவர்கள் குற்றவாளிகள் அல்ல.", en: "Those accused are not guilty until it is proved in court." };
/** a story sent before 26 Nov has no kind: its news type picks the nearest line */
const BY_TYPE: Record<string, string> = { power: "power_cut", collector: "govt", accident: "death", crime: "crime", rain: "weather_agri",
  civic: "civic", edu: "education", event: "events", business: "business" };

export const CORRECTION = {
  ta: "செய்தி தொடர்பான திருத்தம், விளக்கம் அல்லது பகிர்வில் ஆட்சேபனை இருந்தால் எங்கள் Instagram / Facebook பக்கத்தின் DM மூலம் தெரிவிக்கலாம்.",
  en: "For a correction, a clarification or an objection to this news, message us (DM) on our Instagram / Facebook page.",
};

/** the safe line for this story ("crime", "death+not_guilty", or '' -> from its type) */
export function safeLine(kind: string | undefined, type: string, lang: Lang): string {
  const [k, flag] = String(kind || "").split("+");
  const line = LINES[k] ?? LINES[BY_TYPE[type] ?? "other"] ?? LINES.other;
  return line[lang] + (flag === "not_guilty" && k !== "crime" ? " " + NOT_GUILTY[lang] : "");
}
