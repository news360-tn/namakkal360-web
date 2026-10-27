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
    expect(f).toEqual([{ label: "நேரம்", value: "காலை 9 மணி முதல் மதியம் 2 மணி வரை" }, { label: "பகுதிகள்", value: "ராசிபுரம் நகரம்" }]);
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
  ])("%s", (text, taluk, place) => expect(locate(text)).toEqual({ taluk, place }));
  it("district-wide news without a town goes to Namakkal", () => expect(locate("மாவட்டம் முழுவதும் மழை")).toEqual({ taluk: "namakkal", place: "" }));
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
    expect(sanitize({ taluk: "rasipuram'; DROP", type: "bogus", date: "2026-13-99x", page: "-5" })).toEqual({ taluk: undefined, place: undefined, type: undefined, date: undefined, q: undefined, page: 0 });
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
    expect(row).toMatchObject({ id: "RN-131", taluk: "sendamangalam", place: "kalappanaickenpatti", type: "power", day: "2026-10-27", time: "02:14",
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
