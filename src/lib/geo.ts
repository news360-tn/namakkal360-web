/** The 7 districts of the 360 pages (Namakkal, Coimbatore, Salem, Erode, Karur, Tirupur, Trichy): their taluks and the
 *  towns/villages inside them. Used for the district / area filters and to file each story under its taluk automatically
 *  from the story's location text. Taluk ids are unique across all districts. */
export interface Place { id: string; ta: string; en: string; alt?: string[] }
export interface Taluk { id: string; ta: string; en: string; places: Place[]; banner?: string; credit?: string }
export interface District {
  id: string; ta: string; en: string; short_ta: string; short_en: string; code: string; insta?: string;
  banner?: string; credit?: string; art: string; dot: string; taluks: Taluk[];
}
const P = (id: string, ta: string, en: string, alt?: string[]): Place => (alt ? { id, ta, en, alt } : { id, ta, en });
const T = (id: string, ta: string, en: string, places: Place[]): Taluk => ({ id, ta, en, places: [P(id, ta, en), ...places] });

/** Namakkal district: 8 taluks (unchanged ids - old links keep working) */
export const NAMAKKAL_TALUKS: Taluk[] = [
  { id: "namakkal", ta: "நாமக்கல்", en: "Namakkal", banner: "/places/namakkal-fort.webp", credit: "Ssriram mt · CC BY-SA 4.0",
    places: [{ id: "namakkal", ta: "நாமக்கல்", en: "Namakkal" }, { id: "erumapatti", ta: "எருமப்பட்டி", en: "Erumapatti" },
             { id: "puduchatram", ta: "புதுச்சத்திரம்", en: "Puduchatram" }, { id: "siluvampatti", ta: "சிலுவம்பட்டி", en: "Siluvampatti" },
             { id: "valaiyapatti", ta: "வளையப்பட்டி", en: "Valaiyapatti" }] },
  { id: "rasipuram", ta: "இராசிபுரம்", en: "Rasipuram", banner: "/places/rasipuram.webp", credit: "Jagadeeswarann99 · CC BY 4.0",
    places: [{ id: "rasipuram", ta: "இராசிபுரம்", en: "Rasipuram", alt: ["ராசிபுரம்"] }, { id: "vennandur", ta: "வெண்ணந்தூர்", en: "Vennandur" },
             { id: "namagiripettai", ta: "நாமகிரிப்பேட்டை", en: "Namagiripettai" }, { id: "pudupatti", ta: "புதுப்பட்டி", en: "Pudupatti" },
             { id: "pillanallur", ta: "பிள்ளாநல்லூர்", en: "Pillanallur" }] },
  { id: "tiruchengode", ta: "திருச்செங்கோடு", en: "Tiruchengode", banner: "/places/tiruchengode.webp", credit: "Janani Muthu · CC BY-SA 4.0",
    places: [{ id: "tiruchengode", ta: "திருச்செங்கோடு", en: "Tiruchengode" }, { id: "mallasamudram", ta: "மல்லசமுத்திரம்", en: "Mallasamudram" },
             { id: "elachipalayam", ta: "எலச்சிபாளையம்", en: "Elachipalayam" }, { id: "velagoundampatti", ta: "வேலகவுண்டம்பட்டி", en: "Velagoundampatti" }] },
  { id: "kumarapalayam", ta: "குமாரபாளையம்", en: "Kumarapalayam", banner: "/places/kumarapalayam-cauvery.webp", credit: "Wikimedia Commons · CC BY-SA 3.0",
    places: [{ id: "kumarapalayam", ta: "குமாரபாளையம்", en: "Kumarapalayam", alt: ["கொமாரபாளையம்"] }, { id: "pallipalayam", ta: "பள்ளிபாளையம்", en: "Pallipalayam" },
             { id: "veppadai", ta: "வெப்படை", en: "Veppadai" }] },
  { id: "pvelur", ta: "ப.வேலூர்", en: "P. Velur", banner: "/places/banner-cauvery.webp", credit: "Namakkal District Administration",
    places: [{ id: "velur", ta: "பரமத்தி வேலூர்", en: "Paramathi Velur", alt: ["ப.வேலூர்", "பரமத்தி"] }, { id: "kabilarmalai", ta: "கபிலர்மலை", en: "Kabilarmalai" },
             { id: "jedarpalayam", ta: "ஜேடர்பாளையம்", en: "Jedarpalayam" }, { id: "pothanur", ta: "பொத்தனூர்", en: "Pothanur" },
             { id: "olappalayam", ta: "ஓலப்பாளையம்", en: "Olappalayam" }] },
  { id: "sendamangalam", ta: "சேந்தமங்கலம்", en: "Sendamangalam", banner: "/places/sendamangalam.webp", credit: "D Neethidoss · CC BY-SA 4.0",
    places: [{ id: "sendamangalam", ta: "சேந்தமங்கலம்", en: "Sendamangalam" }, { id: "kalappanaickenpatti", ta: "காளப்பநாயக்கன்பட்டி", en: "Kalappanaickenpatti" },
             { id: "kuppanaickanur", ta: "குப்பநாயக்கனூர்", en: "Kuppanaickanur" }, { id: "rnpudur", ta: "ராமநாதபுரம் புதூர்", en: "Ramanathapuram Pudur" },
             { id: "bommasamudram", ta: "பொம்மசமுத்திரம்", en: "Bommasamudram" }] },
  { id: "mohanur", ta: "மோகனூர்", en: "Mohanur", banner: "/places/banner-fort-park.webp", credit: "Namakkal District Administration",
    places: [{ id: "mohanur", ta: "மோகனூர்", en: "Mohanur" }, { id: "valavanthi", ta: "வளவந்தி", en: "Valavanthi" }] },
  { id: "kolli", ta: "கொல்லிமலை", en: "Kolli Hills", banner: "/places/banner-kolli-mist.webp", credit: "Namakkal District Administration",
    places: [{ id: "semmedu", ta: "செம்மேடு", en: "Semmedu" }, { id: "valappur", ta: "வளப்பூர் நாடு", en: "Valappur Nadu" },
             { id: "kolli", ta: "கொல்லிமலை", en: "Kolli Hills" }] },
];

export const DISTRICTS: District[] = [
  { id: "namakkal", ta: "நாமக்கல்", en: "Namakkal", short_ta: "நாமக்கல்", short_en: "Namakkal", code: "", insta: "namakkal.360",
    banner: "/places/banner-fort-park.webp", credit: "Namakkal District Administration",
    art: "from-emerald-700 via-green-600 to-lime-500", dot: "bg-emerald-500", taluks: NAMAKKAL_TALUKS },
  { id: "coimbatore", ta: "கோயம்புத்தூர்", en: "Coimbatore", short_ta: "கோவை", short_en: "Coimbatore", code: "CBE",
    art: "from-sky-700 via-cyan-600 to-teal-400", dot: "bg-sky-500", taluks: [
    T("coimbatore", "கோயம்புத்தூர்", "Coimbatore", [P("kovai", "கோவை", "Kovai"), P("gandhipuram", "காந்திபுரம்", "Gandhipuram"), P("peelamedu", "பீளமேடு", "Peelamedu"),
      P("singanallur", "சிங்காநல்லூர்", "Singanallur"), P("ukkadam", "உக்கடம்", "Ukkadam"), P("podanur", "போத்தனூர்", "Podanur"), P("kuniyamuthur", "குனியமுத்தூர்", "Kuniyamuthur"),
      P("thudiyalur", "துடியலூர்", "Thudiyalur"), P("vadavalli", "வடவள்ளி", "Vadavalli"), P("perur", "பேரூர்", "Perur"), P("thadagam", "தடாகம்", "Thadagam"),
      P("saravanampatti", "சரவணம்பட்டி", "Saravanampatti"), P("ramanathapuram-cbe", "ராமநாதபுரம்", "Ramanathapuram")]),
    T("mettupalayam", "மேட்டுப்பாளையம்", "Mettupalayam", [P("karamadai", "காரமடை", "Karamadai"), P("sirumugai", "சிறுமுகை", "Sirumugai")]),
    T("pollachi", "பொள்ளாச்சி", "Pollachi", [P("negamam", "நெகமம்", "Negamam"), P("kottur", "கோட்டூர்", "Kottur"), P("zaminuthukuli", "ஜமீன் ஊத்துக்குளி", "Zamin Uthukuli")]),
    T("annur", "அன்னூர்", "Annur", []),
    T("sulur", "சூலூர்", "Sulur", [P("karumathampatti", "கருமத்தம்பட்டி", "Karumathampatti"), P("sultanpet", "சுல்தான்பேட்டை", "Sultanpet")]),
    T("kinathukadavu", "கிணத்துக்கடவு", "Kinathukadavu", []),
    T("madukkarai", "மதுக்கரை", "Madukkarai", [P("ettimadai", "எட்டிமடை", "Ettimadai")]),
    T("anaimalai", "ஆனைமலை", "Anaimalai", [P("topslip", "டாப்சிலிப்", "Topslip")]),
    T("valparai", "வால்பாறை", "Valparai", [])] },
  { id: "salem", ta: "சேலம்", en: "Salem", short_ta: "சேலம்", short_en: "Salem", code: "SLM",
    art: "from-indigo-700 via-violet-600 to-fuchsia-500", dot: "bg-violet-500", taluks: [
    T("salem", "சேலம்", "Salem", [P("suramangalam", "சூரமங்கலம்", "Suramangalam"), P("ammapet", "அம்மாபேட்டை", "Ammapet"), P("hasthampatti", "அஸ்தம்பட்டி", "Hasthampatti"),
      P("kondalampatti", "கொண்டலாம்பட்டி", "Kondalampatti"), P("fairlands", "ஃபேர்லேண்ட்ஸ்", "Fairlands"), P("seelanaickenpatti", "சீலநாயக்கன்பட்டி", "Seelanaickenpatti"),
      P("panamarathupatti", "பனமரத்துப்பட்டி", "Panamarathupatti"), P("veerapandi-slm", "வீரபாண்டி", "Veerapandi")]),
    T("attur", "ஆத்தூர்", "Attur", [P("thalaivasal", "தலைவாசல்", "Thalaivasal"), P("narasingapuram", "நரசிங்கபுரம்", "Narasingapuram")]),
    T("omalur", "ஓமலூர்", "Omalur", [P("tharamangalam", "தாரமங்கலம்", "Tharamangalam"), P("jalakandapuram", "ஜலகண்டாபுரம்", "Jalakandapuram")]),
    T("mettur", "மேட்டூர்", "Mettur", [P("kolathur", "கொளத்தூர்", "Kolathur"), P("nangavalli", "நங்கவள்ளி", "Nangavalli")]),
    T("edappadi", "எடப்பாடி", "Edappadi", [P("konganapuram", "கொங்கணாபுரம்", "Konganapuram"), P("poolampatti", "பூலாம்பட்டி", "Poolampatti")]),
    T("sankagiri", "சங்ககிரி", "Sankagiri", []),
    T("vazhapadi", "வாழப்பாடி", "Vazhapadi", [P("ayothiyapattinam", "அயோத்தியாப்பட்டணம்", "Ayothiyapattinam")]),
    T("yercaud", "ஏற்காடு", "Yercaud", []),
    T("gangavalli", "கெங்கவல்லி", "Gangavalli", [P("thammampatti", "தம்மம்பட்டி", "Thammampatti")]),
    T("pnpalayam", "பெத்தநாயக்கன்பாளையம்", "Pethanaickenpalayam", [P("ethapur", "ஏத்தாப்பூர்", "Ethapur")]),
    T("kadayampatti", "காடையாம்பட்டி", "Kadayampatti", [P("deevattipatti", "தீவட்டிப்பட்டி", "Deevattipatti")])] },
  { id: "erode", ta: "ஈரோடு", en: "Erode", short_ta: "ஈரோடு", short_en: "Erode", code: "ERD",
    art: "from-amber-700 via-orange-600 to-yellow-400", dot: "bg-orange-500", taluks: [
    T("erode", "ஈரோடு", "Erode", [P("chithode", "சித்தோடு", "Chithode"), P("veerappanchatram", "வீரப்பன்சத்திரம்", "Veerappanchatram"), P("surampatti", "சூரம்பட்டி", "Surampatti"),
      P("karungalpalayam", "கருங்கல்பாளையம்", "Karungalpalayam"), P("solar", "சோலார்", "Solar")]),
    T("perundurai", "பெருந்துறை", "Perundurai", [P("chennimalai", "சென்னிமலை", "Chennimalai"), P("vijayamangalam", "விஜயமங்கலம்", "Vijayamangalam")]),
    T("gobi", "கோபிசெட்டிபாளையம்", "Gobichettipalayam", [P("gobi-town", "கோபி", "Gobi")]),
    T("bhavani", "பவானி", "Bhavani", [P("ammapettai-erd", "அம்மாபேட்டை", "Ammapettai"), P("kavindapadi", "கவுந்தப்பாடி", "Kavindapadi")]),
    T("sathy", "சத்தியமங்கலம்", "Sathyamangalam", [P("puliampatti", "புஞ்சை புளியம்பட்டி", "Punjai Puliampatti", ["புளியம்பட்டி"]), P("bhavanisagar", "பவானிசாகர்", "Bhavanisagar")]),
    T("anthiyur", "அந்தியூர்", "Anthiyur", [P("bargur", "பர்கூர்", "Bargur")]),
    T("kodumudi", "கொடுமுடி", "Kodumudi", [P("sivagiri", "சிவகிரி", "Sivagiri")]),
    T("modakurichi", "மொடக்குறிச்சி", "Modakurichi", []),
    T("thalavadi", "தாளவாடி", "Thalavadi", []),
    T("nambiyur", "நம்பியூர்", "Nambiyur", [])] },
  { id: "karur", ta: "கரூர்", en: "Karur", short_ta: "கரூர்", short_en: "Karur", code: "KRR",
    art: "from-rose-700 via-red-600 to-orange-400", dot: "bg-rose-500", taluks: [
    T("karur", "கரூர்", "Karur", [P("thanthonimalai", "தாந்தோணிமலை", "Thanthonimalai"), P("vengamedu", "வெங்கமேடு", "Vengamedu"), P("vangal", "வாங்கல்", "Vangal")]),
    T("aravakurichi", "அரவக்குறிச்சி", "Aravakurichi", [P("pallapatti", "பள்ளப்பட்டி", "Pallapatti")]),
    T("krpuram", "கிருஷ்ணராயபுரம்", "Krishnarayapuram", [P("mayanur", "மாயனூர்", "Mayanur")]),
    T("kulithalai", "குளித்தலை", "Kulithalai", []),
    T("manmangalam", "மண்மங்கலம்", "Manmangalam", [P("pugalur", "புகழூர்", "Pugalur"), P("velayuthampalayam", "வேலாயுதம்பாளையம்", "Velayuthampalayam")]),
    T("kadavur", "கடவூர்", "Kadavur", [P("tharagampatti", "தரகம்பட்டி", "Tharagampatti")])] },
  { id: "tirupur", ta: "திருப்பூர்", en: "Tirupur", short_ta: "திருப்பூர்", short_en: "Tirupur", code: "TPR",
    art: "from-blue-700 via-indigo-600 to-sky-400", dot: "bg-blue-500", taluks: [
    T("tirupur", "திருப்பூர்", "Tirupur", [P("veerapandi-tpr", "வீரபாண்டி", "Veerapandi"), P("nallur", "நல்லூர்", "Nallur"), P("mannarai", "மண்ணரை", "Mannarai"),
      P("perumanallur", "பெருமாநல்லூர்", "Perumanallur")]),
    T("avinashi", "அவிநாசி", "Avinashi", [P("thekkalur", "தெக்கலூர்", "Thekkalur")]),
    T("palladam", "பல்லடம்", "Palladam", [P("pongalur", "பொங்கலூர்", "Pongalur")]),
    T("dharapuram", "தாராபுரம்", "Dharapuram", [P("moolanur", "மூலனூர்", "Moolanur")]),
    T("kangeyam", "காங்கேயம்", "Kangeyam", [P("vellakoil", "வெள்ளகோவில்", "Vellakoil")]),
    T("udumalai", "உடுமலைப்பேட்டை", "Udumalaipettai", [P("udumalai-town", "உடுமலை", "Udumalai"), P("amaravathi", "அமராவதி", "Amaravathi")]),
    T("madathukulam", "மடத்துக்குளம்", "Madathukulam", []),
    T("uthukuli", "ஊத்துக்குளி", "Uthukuli", [])] },
  { id: "trichy", ta: "திருச்சி", en: "Trichy", short_ta: "திருச்சி", short_en: "Trichy", code: "TRY",
    art: "from-teal-700 via-emerald-600 to-yellow-400", dot: "bg-teal-500", taluks: [
    T("trichy", "திருச்சி", "Trichy", [P("tiruchirappalli", "திருச்சிராப்பள்ளி", "Tiruchirappalli"), P("chathiram", "சத்திரம்", "Chathiram"), P("woraiyur", "உறையூர்", "Woraiyur"),
      P("kknagar", "கே.கே.நகர்", "K.K. Nagar"), P("palakkarai", "பாலக்கரை", "Palakkarai"), P("manikandam", "மணிகண்டம்", "Manikandam")]),
    T("srirangam", "ஸ்ரீரங்கம்", "Srirangam", [P("tiruvanaikoil", "திருவானைக்காவல்", "Tiruvanaikoil")]),
    T("tiruverumbur", "திருவெறும்பூர்", "Tiruverumbur", [P("thuvakudi", "துவாக்குடி", "Thuvakudi"), P("bhel", "பெல்", "BHEL")]),
    T("lalgudi", "லால்குடி", "Lalgudi", [P("pullambadi", "புள்ளம்பாடி", "Pullambadi")]),
    T("manachanallur", "மண்ணச்சநல்லூர்", "Manachanallur", [P("samayapuram", "சமயபுரம்", "Samayapuram")]),
    T("manapparai", "மணப்பாறை", "Manapparai", [P("vaiyampatti", "வையம்பட்டி", "Vaiyampatti")]),
    T("musiri", "முசிறி", "Musiri", []),
    T("thottiyam", "தொட்டியம்", "Thottiyam", []),
    T("thuraiyur", "துறையூர்", "Thuraiyur", [P("uppiliyapuram", "உப்பிலியபுரம்", "Uppiliyapuram")]),
    T("marungapuri", "மருங்காபுரி", "Marungapuri", [P("thuvarankurichi", "துவரங்குறிச்சி", "Thuvarankurichi")])] },
];
/** every taluk of every district (ids are unique) */
export const TALUKS: Taluk[] = DISTRICTS.flatMap((d) => d.taluks);
export const DISTRICT = { banner: "/places/banner-fort-park.webp", credit: "Namakkal District Administration" };
export const districtOf = (id: string | undefined) => DISTRICTS.find((d) => d.id === id);
/** the district a taluk belongs to */
export const districtOfTaluk = (tk: string) => DISTRICTS.find((d) => d.taluks.some((t) => t.id === tk));
export const talukOf = (id: string) => TALUKS.find((t) => t.id === id);
export const placeOf = (tk: string, pl: string) => talukOf(tk)?.places.find((p) => p.id === pl);
/** database id of a story: Namakkal keeps the plain pipeline id (RN-140, old links work); the others get the district code (CBE-RN-598) */
export const rowId = (district: string, storyId: string) => { const c = districtOf(district)?.code; return c ? `${c}-${storyId}` : storyId; };

/** Tamil adds endings (ராசிபுரத்தில், நாமக்கல்லில், மோகனூரில்): match on the name without its last letter-sign. */
const stem = (w: string) => w.replace(/(ம்|ர்|ல்|ன்|டு|ை|ு)$/u, "");

/** "சிலுவம்பட்டி, நாமக்கல்" / headline text -> { taluk, place } inside one district (most specific place wins; district-wide -> its main taluk) */
export function locate(district: string, ...texts: string[]): { taluk: string; place: string } {
  const d = districtOf(district) ?? DISTRICTS[0];
  const t = texts.join(" ").replace(/ுா/g, "ூ").toLowerCase();
  let best: { taluk: string; place: string; len: number } | null = null;
  for (const tk of d.taluks)
    for (const p of tk.places)
      for (const name of [p.ta, p.en.toLowerCase(), ...(p.alt ?? [])]) {
        const key = /[a-z]/.test(name) ? name : stem(name);
        // the district's own name ("Namakkal", "Salem", "கோவை") is in almost every location line: it counts only when no other town is named
        const head = p.id === d.id || (d.id === "coimbatore" && p.id === "kovai") || (d.id === "trichy" && p.id === "tiruchirappalli");
        const score = key.length - (head ? 100 : 0);
        if (key.length >= 3 && t.includes(key) && (!best || score > best.len)) best = { taluk: tk.id, place: p.id, len: score };
      }
  return best ? { taluk: best.taluk, place: best.place } : { taluk: d.taluks[0].id, place: "" };
}
