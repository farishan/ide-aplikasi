import fs from 'fs';
import tablemark from 'tablemark';

/* CONFIG */
const INSERTION_POINT = '# Koleksi Ide';
const COLUMNS = ['Nama', 'Deskripsi Singkat', 'Tingkat Kesulitan'];
const DIFFICULTY_MAP = {
  1: 'Gampang',
  2: 'Lumayan',
  3: 'Susah'
};
const INPUT = './data.json';
const TARGET_FILE = './README.md';

function merge(markdownTable) {
  const oldContent = fs.readFileSync(TARGET_FILE, 'utf-8');
  const insertionPoint =
    oldContent.indexOf(INSERTION_POINT) + INSERTION_POINT.length;
  const newContent =
    oldContent.slice(0, insertionPoint) + '\n\n' + markdownTable + '\n';
  fs.writeFileSync(TARGET_FILE, newContent);
}

function main() {
  const json = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
  json.map((d) => (d.difficulty = DIFFICULTY_MAP[d.difficulty]));
  const markdownTable = tablemark(json, { columns: COLUMNS });

  merge(markdownTable);

  console.log('Markdown table has been replaced in README.md.');
}

main();
