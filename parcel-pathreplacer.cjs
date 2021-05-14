const fs = require("fs/promises");
const path = require("path");

async function* getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else if (dirent.name.endsWith(".ts") || dirent.name.endsWith(".tsx")) {
      yield path.relative(__dirname, res);
    }
  }
}

async function main() {
  for await (const f of getFiles("./src")) {
    const contents = await fs.readFile(f, "utf-8");
    const r = replacement(f);
    const newContents = contents
      .replaceAll("from '~", `from '${r}`)
      .replaceAll('from "~', `from "${r}`);

    if (contents != newContents) {
      fs.writeFile(f, newContents);
    }
  }
}

function replacement(filePath) {
  const n = filePath.split("/").length - 2;
  return Array.from({ length: n })
    .map(() => "..")
    .join("/");
}

main().catch(console.error);
