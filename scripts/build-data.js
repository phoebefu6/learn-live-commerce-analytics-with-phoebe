/* Builds data/streams.json, data/streams.csv, data/summary.csv and data/canon.json from the
   engine with its fixed seed. Run: node scripts/build-data.js. Re-running produces identical files. */
const fs = require("fs"), path = require("path");
const E = require(path.join(__dirname, "..", "assets", "live-engine.js"));
const out = path.join(__dirname, "..", "data");
fs.mkdirSync(out, { recursive: true });
const H = E.history();
const tonight = E.simulate(E.tonightParams());
fs.writeFileSync(path.join(out, "streams.csv"), E.toCsv(H));
const sumCols = Object.keys(H[0].summary);
fs.writeFileSync(path.join(out, "summary.csv"), sumCols.join(",") + "\n" + H.map(s => sumCols.map(k => s.summary[k]).join(",")).join("\n") + "\n");
fs.writeFileSync(path.join(out, "streams.json"), JSON.stringify({
  brand: E.BRAND, sku: E.SKU, hosts: E.HOSTS, minutes: E.MINUTES, columns: E.MINUTE_COLS,
  streams: H.map(s => ({ summary: s.summary, minutes: s.minutes })),
  tonight: { summary: tonight.summary, minutes: tonight.minutes }
}));
const ladder = E.ladder(40);
fs.writeFileSync(path.join(out, "canon.json"), JSON.stringify({ builtFrom: "assets/live-engine.js", seed: 20260924, nights: 40, ladder, truth: E.TRUTH }, null, 2));
console.log("streams", H.length, "minute rows", H.length * E.MINUTES);
ladder.forEach(x => console.log(x.policy.padEnd(16), "gmv", x.gmv, "orders", x.orders, "watch", x.avgWatchMin, "peak", x.peakRoom, "flags", x.riskFlags, "cvr", x.cvr, "views", x.views));
