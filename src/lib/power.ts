/** Power-cut hours from the notice text ("காலை 9 முதல் மதியம் 2 வரை", "9 am to 2 pm") -> [from, to] in 24 h, or null. */
export function powerHours(text: string): [number, number] | null {
  const t = String(text || "");
  const ta = t.match(/(காலை|மதியம்|மாலை|இரவு|பிற்பகல்)?\s*(\d{1,2})(?:[.:](\d{2}))?\s*(?:மணி\s*)?(?:முதல்|-)\s*(காலை|மதியம்|மாலை|இரவு|பிற்பகல்)?\s*(\d{1,2})(?:[.:](\d{2}))?\s*(?:மணி\s*)?வரை/u);
  if (ta) {
    const h = (w: string | undefined, n: string) => { let x = +n; if ((w && w !== "காலை" && x < 12) || (!w && x <= 7)) x += 12; return x; };
    return [h(ta[1], ta[2]) + +(ta[3] || 0) / 60, h(ta[4], ta[5]) + +(ta[6] || 0) / 60];
  }
  const en = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:to|-|till|until)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (en) {
    const h = (n: string, ap?: string) => { let x = +n; if (ap?.toLowerCase() === "pm" && x < 12) x += 12; if (!ap && x <= 7) x += 12; return x; };
    return [h(en[1], en[3]) + +(en[2] || 0) / 60, h(en[4], en[6]) + +(en[5] || 0) / 60];
  }
  return null;
}
