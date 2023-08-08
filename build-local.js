import fs from 'fs';
import tablemark from 'tablemark';
import {
  INSERTION_POINT,
  COLUMNS,
  DIFFICULTY_MAP,
  INPUT,
  TARGET_FILE
} from './config.js';

export function getNewContent() {
  const json = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
  json.map((d) => (d.difficulty = DIFFICULTY_MAP[d.difficulty]));
  const markdownTable = tablemark(json, { columns: COLUMNS });
  return markdownTable
}

function getOldContent() {
  return fs.readFileSync(TARGET_FILE, 'utf-8');
}

function setContent(content) {
  fs.writeFileSync(TARGET_FILE, content);
}

export function getInsertionPoint(content) {
  return content.indexOf(INSERTION_POINT) + INSERTION_POINT.length
}

export function merge(oldContent, newContent /* markdown table */) {
  const insertionPoint = getInsertionPoint(oldContent)
  const result =
    oldContent.slice(0, insertionPoint) + '\n\n' + newContent + '\n';
  return result
}

function main() {
  const markdownTable = getNewContent();
  const merged = merge(getOldContent(), markdownTable);
  setContent(merged)

  console.log('Markdown table has been replaced in README.md.');
}

main();
