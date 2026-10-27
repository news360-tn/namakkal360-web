/** Namakkal district: 8 taluks and the towns/villages inside them. Used for the area filter and to file each story
 *  under its taluk automatically from the story's location text. (Village-to-taluk list to be checked against the
 *  official district list before launch.) */
export interface Place { id: string; ta: string; en: string; alt?: string[] }
export interface Taluk { id: string; ta: string; en: string; places: Place[]; banner: string; credit: string }

export const TALUKS: Taluk[] = [
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
export const DISTRICT = { banner: "/places/banner-fort-park.webp", credit: "Namakkal District Administration" };
export const talukOf = (id: string) => TALUKS.find((t) => t.id === id);
export const placeOf = (tk: string, pl: string) => talukOf(tk)?.places.find((p) => p.id === pl);

/** Tamil adds endings (ராசிபுரத்தில், நாமக்கல்லில், மோகனூரில்): match on the name without its last letter-sign. */
const stem = (w: string) => w.replace(/(ம்|ர்|ல்|ன்|டு|ை|ு)$/u, "");

/** "சிலுவம்பட்டி, நாமக்கல்" / headline text -> { taluk, place } (most specific place wins; district-wide -> namakkal) */
export function locate(...texts: string[]): { taluk: string; place: string } {
  const t = texts.join(" ").replace(/ுா/g, "ூ").toLowerCase();
  let best: { taluk: string; place: string; len: number } | null = null;
  for (const tk of TALUKS)
    for (const p of tk.places)
      for (const name of [p.ta, p.en.toLowerCase(), ...(p.alt ?? [])]) {
        const key = /[a-z]/.test(name) ? name : stem(name);
        // "Namakkal" is in almost every location line as the DISTRICT name: it counts only when no other town is named
        const score = key.length - (p.id === "namakkal" ? 100 : 0);
        if (key.length >= 3 && t.includes(key) && (!best || score > best.len)) best = { taluk: tk.id, place: p.id, len: score };
      }
  return best ? { taluk: best.taluk, place: best.place } : { taluk: "namakkal", place: "" };
}
