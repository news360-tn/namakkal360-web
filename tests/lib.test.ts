import { describe, it, expect } from "vitest";
import { clean, esc, factsFromCaption } from "../src/lib/text";
import { typeFromCategory } from "../src/lib/types";
import { locate } from "../src/lib/geo";
import { powerHours } from "../src/lib/power";
import { sanitize, whereOf, toRow, istDay } from "../src/lib/news";
import { cardHtml, alertHtml } from "../src/lib/card";

describe("text", () => {
  it("never shows long dashes or the writer's <b> marks", () => {
    expect(clean("காலை 9 – மதியம் 2 — மின் தடை")).toBe("காலை 9 - மதியம் 2 - மின் தடை");
    expect(clean("<b>90,703</b> குழந்தைகள்")).toBe("90,703 குழந்தைகள்");
    expect(esc('5 < 7 & "x"')).toBe("5 &lt; 7 &amp; &quot;x&quot;");
  });
  it("reads the caption's full-details lines", () => {
    const f = factsFromCaption("📰 முழு விவரம்:\nசில வரிகள்\n🕘 நேரம்: காலை 9 மணி முதல் மதியம் 2 மணி வரை\n🏘️ பகுதிகள்: ராசிபுரம் நகரம்\n#Namakkal360");
    expect(f).toEqual([{ label: "", value: "சில வரிகள்" }, { label: "நேரம்", value: "காலை 9 மணி முதல் மதியம் 2 மணி வரை" }, { label: "பகுதிகள்", value: "ராசிபுரம் நகரம்" }]);
  });
  it("keeps every detail line and stops at the place footer", () => {
    const f = factsFromCaption("👶 தலைப்பு\n\n📰 முழு விவரம்:\nமுகாம் நடைபெற்றது.\n🩺 வைட்டமின் ஏ முக்கிய சத்து.\n\n📍 நாமக்கல் | 27 அக்டோபர்\nFollow செய்யுங்கள்\n#Namakkal360");
    expect(f.map((x) => x.value)).toEqual(["முகாம் நடைபெற்றது.", "வைட்டமின் ஏ முக்கிய சத்து."]);
  });
});

describe("news type from the pipeline category", () => {
  it.each([
    ["மின் தடை", "", "power"], ["Crime & Safety", "தனியார் பேருந்து மோதி தொழிலாளி உயிரிழப்பு", "accident"], ["Crime & Safety", "புகையிலை விற்ற 2 பேர் கைது", "crime"],
    ["Weather & Agriculture", "", "rain"], ["Education", "", "edu"], ["Temples & Events", "", "event"], ["Business & Prices", "முட்டை விலை", "business"],
    ["Government & Services", "", "collector"], ["Health", "வைட்டமின் ஏ முகாம்", "collector"], ["Civic Issues", "", "civic"],
  ])("%s / %s -> %s", (c, h, want) => expect(typeFromCategory(c, h)).toBe(want));
});

describe("area from the location text", () => {
  it.each([
    ["சிலுவம்பட்டி, நாமக்கல்", "namakkal", "siluvampatti"], ["ராசிபுரத்தில் மின்தடை", "rasipuram", "rasipuram"],
    ["மல்லசமுத்திரம் அருகே", "tiruchengode", "mallasamudram"], ["ப.வேலூர் அருகே", "pvelur", "velur"],
    ["ப.வேலுார் அருகே", "pvelur", "velur"], ["மோகனூரில்", "mohanur", "mohanur"], ["Kolli Hills rain", "kolli", "kolli"],
    ["காளப்பநாயக்கன்பட்டி துணை மின் நிலையம்", "sendamangalam", "kalappanaickenpatti"], ["நாமக்கல் மாவட்டம்", "namakkal", "namakkal"],
  ])("%s", (text, taluk, place) => expect(locate("namakkal", text)).toEqual({ taluk, place }));
  it.each([["Pothanur, Namakkal", "pvelur", "pothanur"], ["பொத்தனூர், நாமக்கல்", "pvelur", "pothanur"], ["Mohanur, Namakkal district", "mohanur", "mohanur"],
    ["நாமக்கல்", "namakkal", "namakkal"]])("district name does not hide the town: %s", (text, taluk, place) => expect(locate("namakkal", text)).toEqual({ taluk, place }));
  it("district-wide news without a town goes to Namakkal", () => expect(locate("namakkal", "மாவட்டம் முழுவதும் மழை")).toEqual({ taluk: "namakkal", place: "" }));
});

describe("power-cut hours", () => {
  it.each([
    ["காலை 9 முதல் மதியம் 2 வரை மின் தடை", [9, 14]], ["காலை 9 மணி முதல் மாலை 5 மணி வரை", [9, 17]],
    ["9 am to 2 pm", [9, 14]], ["காலை 10:30 முதல் மதியம் 1 வரை", [10.5, 13]],
  ] as [string, [number, number]][])("%s", (t, want) => expect(powerHours(t)).toEqual(want));
  it("no hours -> null", () => expect(powerHours("நாளை மின்தடை")).toBeNull());
});

describe("filters", () => {
  it("only known values reach the query", () => {
    expect(sanitize({ taluk: "rasipuram'; DROP", type: "bogus", date: "2026-13-99x", page: "-5" })).toEqual({ district: undefined, taluk: undefined, place: undefined, type: undefined, date: undefined, q: undefined, page: 0 });
    expect(sanitize({ taluk: "rasipuram", place: "vennandur", type: "power", date: "today" })).toMatchObject({ taluk: "rasipuram", place: "vennandur", type: "power", date: "today" });
    expect(sanitize({ taluk: "rasipuram", place: "mohanur" }).place).toBeUndefined();      // a town of another taluk is ignored
  });
  it("date filters use India time", () => {
    const now = Date.UTC(2026, 9, 26, 20, 0);      // 27 Oct 01:30 IST
    expect(whereOf({ date: "today" }, now).args).toEqual(["2026-10-27"]);
    expect(whereOf({ date: "yesterday" }, now).args).toEqual(["2026-10-26"]);
    expect(whereOf({ taluk: "kolli", type: "rain" }).sql).toBe("WHERE taluk = ? AND type = ?");
  });
});

describe("a story from the pipeline", () => {
  const row = toRow({
    story_id: "RN-131", headline_ta: "காளப்பநாயக்கன்பட்டி துணை மின் நிலையப் பராமரிப்பு: காலை 9 முதல் மதியம் 2 வரை மின் தடை",
    headline_en: "Kalappanaickenpatti substation maintenance — power cut", reel_script: "மாதாந்திரப் பராமரிப்பு <b>9</b> மணி",
    caption: "📰 முழு விவரம்:\n🕘 நேரம்: காலை 9 – மதியம் 2", location: "காளப்பநாயக்கன்பட்டி, நாமக்கல்", category: "மின் தடை",
    images: ["https://res.cloudinary.com/x/a.jpg", "javascript:alert(1)"], reel_link: "நாமக்கல் 360: https://www.instagram.com/reel/De_Zjyuj53j/",
    filed_at: "2026-10-26T20:44:00Z",
  });
  it("is filed under the right area, type, day and hours, cleaned", () => {
    expect(row).toMatchObject({ id: "RN-131", district: "namakkal", taluk: "sendamangalam", place: "kalappanaickenpatti", type: "power", day: "2026-10-27", time: "02:14",
      power_from: 9, power_to: 14, reel_url: "https://www.instagram.com/reel/De_Zjyuj53j/", images: ["https://res.cloudinary.com/x/a.jpg"] });
    expect(row.title_en).toBe("Kalappanaickenpatti substation maintenance - power cut");
    expect(row.body_ta).not.toMatch(/<b>/);
    expect(row.facts).toEqual([{ label: "நேரம்", value: "காலை 9 - மதியம் 2" }]);
  });
  it("renders a card and an alert with no long dashes and escaped text", () => {
    const html = cardHtml({ ...row, title_ta: '<script>x</script> — test' }, "ta") + alertHtml(row, "en");
    expect(html).not.toMatch(/[—–]|<script>/);
    expect(html).toContain("/news/RN-131");
    expect(html).toContain("bg-t-power/15".split("/")[0].replace("bg-", "text-").replace("text-t-power", "text-t-power"));
  });
});

describe("dates", () => it("IST day", () => expect(istDay(0, Date.UTC(2026, 9, 26, 19, 0))).toBe("2026-10-27")));

import { paragraphs } from "../src/lib/text";
describe("story paragraphs", () => {
  it("lead sentence + paragraphs of 2 sentences", () => {
    const p = paragraphs("முதல் வரி. இரண்டாம் வரி. மூன்றாம் வரி. நான்காம் வரி. ஐந்தாம் வரி.");
    expect(p.lead).toBe("முதல் வரி.");
    expect(p.rest).toEqual(["இரண்டாம் வரி. மூன்றாம் வரி.", "நான்காம் வரி. ஐந்தாம் வரி."]);
  });
  it("does not split inside numbers like 4:30 or 1,47,000", () => {
    expect(paragraphs("மாலை 4:30 மணிக்கு கூட்டம். ரூ.1,47,000 பறிமுதல்.").lead).toBe("மாலை 4:30 மணிக்கு கூட்டம்.");
  });
});

import { dropOutro } from "../src/lib/text";
describe("reel follow line is not shown on the website", () => {
  it("drops the outro sentence", () => {
    expect(dropOutro("முகாம் 30 வரை நடைபெறும். மேலும் செய்திகளுக்கு நாமக்கல் த்ரீ சிக்ஸ்டி பக்கத்தை பின்தொடருங்கள்.")).toBe("முகாம் 30 வரை நடைபெறும்.");
    expect(paragraphs("ஒன்று. இரண்டு. Follow Namakkal Three Sixty for more local news.").rest).toEqual(["இரண்டு."]);
  });
});

import { clock } from "../src/lib/card";
describe("time with AM / PM", () => {
  it.each([["06:25", "காலை 6:25", "6:25 AM"], ["10:14", "காலை 10:14", "10:14 AM"], ["12:00", "மதியம் 12:00", "12:00 PM"],
    ["14:30", "மதியம் 2:30", "2:30 PM"], ["18:05", "மாலை 6:05", "6:05 PM"], ["22:23", "இரவு 10:23", "10:23 PM"], ["02:14", "இரவு 2:14", "2:14 AM"]])
    ("%s", (t, ta, en) => { expect(clock(t, "ta")).toBe(ta); expect(clock(t, "en")).toBe(en); });
});

import { DISTRICTS, TALUKS, districtOfTaluk, rowId } from "../src/lib/geo";
describe("one site for all 7 districts", () => {
  it("has the 7 districts and taluk ids that never repeat", () => {
    expect(DISTRICTS.map((d) => d.id)).toEqual(["namakkal", "coimbatore", "salem", "erode", "karur", "tirupur", "trichy"]);
    expect(new Set(TALUKS.map((t) => t.id)).size).toBe(TALUKS.length);
    for (const d of DISTRICTS) for (const t of d.taluks) expect(new Set(t.places.map((p) => p.id)).size).toBe(t.places.length);
  });
  it.each([
    ["coimbatore", "பொள்ளாச்சி அருகே விபத்து", "pollachi", "pollachi"], ["coimbatore", "மேட்டுப்பாளையம், கோவை", "mettupalayam", "mettupalayam"],
    ["coimbatore", "தடாகம், கோவை", "coimbatore", "thadagam"], ["coimbatore", "கோவை மாநகரில்", "coimbatore", "kovai"],
    ["salem", "ஆத்தூரில் மழை", "attur", "attur"], ["salem", "மேட்டூர் அணை, சேலம்", "mettur", "mettur"], ["salem", "சேலம் மாவட்டம்", "salem", "salem"],
    ["erode", "கோபி அருகே", "gobi", "gobi-town"], ["erode", "சத்தியமங்கலம் வனப்பகுதி", "sathy", "sathy"], ["erode", "Perundurai, Erode", "perundurai", "perundurai"],
    ["karur", "குளித்தலை, கரூர்", "kulithalai", "kulithalai"], ["karur", "புகழூர் காகித ஆலை", "manmangalam", "pugalur"],
    ["tirupur", "பல்லடம் அருகே", "palladam", "palladam"], ["tirupur", "உடுமலை, திருப்பூர்", "udumalai", "udumalai-town"], ["tirupur", "வெள்ளகோவில்", "kangeyam", "vellakoil"],
    ["trichy", "ஸ்ரீரங்கம் கோவில்", "srirangam", "srirangam"], ["trichy", "மணப்பாறை, திருச்சி", "manapparai", "manapparai"], ["trichy", "சமயபுரம்", "manachanallur", "samayapuram"],
  ])("%s: %s", (d, text, taluk, place) => expect(locate(d, text)).toEqual({ taluk, place }));
  it("news without a town goes to the district's main taluk", () => {
    expect(locate("salem", "மாவட்டம் முழுவதும்")).toEqual({ taluk: "salem", place: "" });
    expect(locate("trichy", "nothing here")).toEqual({ taluk: "trichy", place: "" });
  });
  it("a story id is unique across districts; Namakkal keeps its old ids", () => {
    expect(rowId("namakkal", "RN-140")).toBe("RN-140");
    expect(rowId("coimbatore", "RN-140")).toBe("CBE-RN-140");
    expect(new Set(DISTRICTS.map((d) => rowId(d.id, "RN-1"))).size).toBe(7);
  });
  it("a story is filed under its district", () => {
    const r = toRow({ story_id: "RN-598", district: "coimbatore", headline_ta: "பொள்ளாச்சியில் சாலை விபத்து", location: "பொள்ளாச்சி, கோவை", category: "Crime & Safety" });
    expect(r).toMatchObject({ id: "CBE-RN-598", district: "coimbatore", taluk: "pollachi", type: "accident" });
    expect(toRow({ story_id: "RN-1", headline_ta: "ராசிபுரத்தில் மின்தடை" })).toMatchObject({ id: "RN-1", district: "namakkal", taluk: "rasipuram" });
  });
  it("filters: an old taluk link finds its district; a taluk of another district is ignored", () => {
    expect(sanitize({ taluk: "rasipuram" })).toMatchObject({ district: "namakkal", taluk: "rasipuram" });
    expect(sanitize({ district: "salem", taluk: "rasipuram" })).toMatchObject({ district: "salem", taluk: undefined });
    expect(sanitize({ district: "nowhere" }).district).toBeUndefined();
    expect(whereOf({ district: "erode", taluk: "gobi" }).sql).toBe("WHERE district = ? AND taluk = ?");
    expect(districtOfTaluk("pollachi")?.id).toBe("coimbatore");
  });
  it("cards on the all-district page say the district", () => {
    const r = toRow({ story_id: "RN-5", district: "trichy", headline_ta: "மணப்பாறையில் நிகழ்ச்சி", location: "மணப்பாறை" });
    expect(cardHtml(r, "en", true)).toContain("Manapparai · Trichy");
    expect(cardHtml(r, "en")).not.toContain("· Trichy");
    expect(cardHtml(r, "ta", true)).toContain("/news/TRY-RN-5");
  });
});

// ---- 26 Nov: news360.pages.dev redesign - links, source, safe note, pencil sketch ----
import { sourceName, FB_LINK, YT_LINK, setLinks } from "../src/lib/news";
import { safeLine } from "../src/lib/safe";
import { links, sourceHtml, cardHtml as card } from "../src/lib/card";

describe("source shown clearly", () => {
  it("names the paper in Tamil and English, or falls back to the site name", () => {
    expect(sourceName("https://www.dailythanthi.com/news/x", "ta")).toBe("தினத்தந்தி");
    expect(sourceName("https://www.dailythanthi.com/news/x", "en")).toBe("Daily Thanthi");
    expect(sourceName("https://tamil.news18.com/a", "en")).toBe("News18 Tamil");
    expect(sourceName("https://www.smallpaper.in/a", "en")).toBe("smallpaper.in");
    expect(sourceName("", "ta")).toBe("");
    expect(sourceName("not a link", "en")).toBe("");
  });
  it("every card with a source shows 'Source: paper' linked to the report; a card without one shows nothing", () => {
    const n = { ...toRow({ story_id: "RN-1", headline_ta: "செய்தி", source: "https://www.dinamalar.com/a" } as any) };
    const html = sourceHtml(n, "en");
    expect(html).toContain("Source:"); expect(html).toContain("Dinamalar"); expect(html).toContain('href="https://www.dinamalar.com/a"'); expect(html).toContain('rel="noopener nofollow"');
    expect(sourceHtml({ ...n, source_url: "" }, "ta")).toBe("");
  });
});

describe("Instagram / Facebook / YouTube links", () => {
  const n = toRow({ story_id: "RN-2", headline_ta: "செய்தி", reel_link: "https://www.instagram.com/reel/AbC_1-2/" } as any);
  it("only the real links are shown, in the same order", () => {
    expect(links(n).map(([k]) => k)).toEqual(["ig"]);
    const all = { ...n, fb_url: "https://www.facebook.com/reel/123", yt_url: "https://youtube.com/shorts/abcDEF12345" };
    expect(links(all).map(([k]) => k)).toEqual(["ig", "fb", "yt"]);
    const html = card(all, "en");
    expect(html).toContain("Instagram"); expect(html).toContain("Facebook"); expect(html).toContain("YouTube");
    expect(card(n, "en")).not.toContain("Facebook");
  });
  it("accepts only Facebook and YouTube Shorts links", () => {
    expect(FB_LINK.test("https://www.facebook.com/reel/123456")).toBe(true);
    expect(FB_LINK.test("https://evil.com/facebook.com/x")).toBe(false);
    expect(FB_LINK.test("javascript:alert(1)")).toBe(false);
    expect(YT_LINK.test("https://youtube.com/shorts/abcDEF12345")).toBe(true);
    expect(YT_LINK.test("https://www.youtube.com/shorts/abcDEF12345")).toBe(true);
    expect(YT_LINK.test("https://youtube.com/watch?v=abc")).toBe(false);
  });
  it("setLinks changes only the two link columns and says what it skipped", async () => {
    const calls: any[] = [];
    const db = { prepare: (sql: string) => ({ bind: (...a: any[]) => ({ run: async () => { calls.push([sql, a]); return { meta: { changes: a[4] === "CBE-RN-1" ? 1 : 0 } }; } }) }) } as any;
    const r = await setLinks(db, [
      { id: "CBE-RN-1", fb_url: "https://www.facebook.com/reel/1", yt_url: "https://youtube.com/shorts/abcDEF12345" },
      { id: "CBE-RN-2", fb_url: "https://www.facebook.com/reel/2" },
      { id: "bad id!", fb_url: "https://www.facebook.com/reel/3" },
      { id: "CBE-RN-3", fb_url: "https://evil.com/x" }]);
    expect(r.saved).toEqual(["CBE-RN-1"]);
    expect(r.skipped.map((x) => x.why)).toEqual(["story not on the site yet", "bad id", "no valid link"]);
    expect(calls[0][0]).toMatch(/UPDATE news SET fb_url/); expect(calls[0][0]).not.toMatch(/title|source_url|reel_url/);
  });
});

describe("safe note (the same lines as the social-media source comment)", () => {
  it("each kind of news has its own Tamil and English line", () => {
    expect(safeLine("crime", "crime", "ta")).toContain("குற்றம் சாட்டப்பட்டவர்கள் குற்றவாளிகள் அல்ல");
    expect(safeLine("crime", "crime", "en")).toContain("not guilty until it is proved in court");
    expect(safeLine("power_cut", "power", "en")).toContain("electricity");
    expect(safeLine("death", "accident", "ta")).toContain("குடும்பத்தினரின் உணர்வுகளை");
  });
  it("a death with someone accused adds the not-guilty line", () => {
    expect(safeLine("death+not_guilty", "accident", "en")).toMatch(/respect.*not guilty/);
  });
  it("an older story without a kind gets the line of its type", () => {
    expect(safeLine("", "power", "en")).toContain("electricity");
    expect(safeLine(undefined, "civic", "ta")).toContain("மக்களின் பிரச்சினைகள்");
    expect(safeLine("zzz", "unknown", "en")).toContain("public information");
  });
  it("ingest keeps only a clean kind", () => {
    expect(toRow({ story_id: "RN-3", headline_ta: "x", safe_kind: "death+not_guilty" } as any).safe_kind).toBe("death+not_guilty");
    expect(toRow({ story_id: "RN-3", headline_ta: "x", safe_kind: "<script>" } as any).safe_kind).toBe("");
  });
});

describe("pencil sketch pictures (no AI images)", () => {
  it("every news photo uses the #sketch filter, the placeholder icon does not", () => {
    const withImg = toRow({ story_id: "RN-4", headline_ta: "x", images: ["https://img.example/a.jpg"] } as any);
    expect(card(withImg, "ta")).toContain("filter:url(#sketch)");
    expect(card({ ...withImg, images: [] }, "ta")).not.toContain("#sketch");
  });
});
