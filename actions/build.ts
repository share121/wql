import { minify } from "npm:html-minifier";
import { escape } from "jsr:@std/html";
import { parse } from "jsr:@std/csv/parse";

await Deno.mkdir("dist").catch(async () => {
  await Deno.remove("dist", { recursive: true });
  await Deno.mkdir("dist");
});

Deno.copyFile("src/img.svg", "dist/img.svg");

const csv = parse(await Deno.readTextFile("src/data.csv"));
const html = csv.map((row) => createCard({ name: row[0], comment: row[1] }))
  .join("");
let raw = await Deno.readTextFile("src/index.html");
raw = raw.replace("{{cards}}", html);

const js = await Deno.readTextFile("src/confetti.js");
raw = raw.replace("{{confetti}}", `<script>${js}</script>`);

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

Deno.writeTextFile(
  "dist/7c40258c7dc2254306e68fa41269fd28.txt",
  "8795a655a0d55735d35c665d064dae0c2407a142",
);

function createCard({ name, comment }: { name: string; comment: string }) {
  return /* html */ `
<div class="card">
  <h3 class="name">${escape(name)}</h3>
  <p class="comment">${escape(comment)}</p>
</div>
`;
}
