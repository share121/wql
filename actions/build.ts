import { minify } from "npm:html-minifier";
import { escape } from "jsr:@std/html";
import { parse } from "jsr:@std/csv/parse";

await Deno.mkdir("dist").catch(async () => {
  await Deno.remove("dist", { recursive: true });
  await Deno.mkdir("dist");
});

const csv = parse(await Deno.readTextFile("src/data.csv"));
const html = csv.map((row) => createCard({ name: row[0], comment: row[1] }))
  .join("");
let raw = await Deno.readTextFile("src/index.html");
raw = raw.replace("{{cards}}", html);

const img = await Deno.readFile("src/img.jpg");
// img to base64 dataurl
const imgBase64 = btoa(
  new Uint8Array(img).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    "",
  ),
);
raw = raw.replace("{{img}}", `data:image/jpg;base64,${imgBase64}`);
Deno.writeTextFile(
  "dist/index.html",
  minify(raw, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
  }),
);

function createCard({ name, comment }: { name: string; comment: string }) {
  return /* html */ `
<div class="card">
  <h3 class="name">${escape(name)}</h3>
  <p class="comment">${escape(comment)}</p>
</div>
`;
}
