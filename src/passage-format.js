export default function format(template, passage) {
  return template
    .replace('${book}', bookName(passage))
    .replace('${chapter}', chapterNumber(passage))
    .replace('${verse}', firstVerseNumber(passage))
    .replace('${verse start}', firstVerseNumber(passage))
    .replace('${verse end}', lastVerseNumber(passage))
    .replace('${text}', text(passage))
    .replace('${text with numbers}', textWithNumbers(passage));
}

function bookName(passage) {
  return firstPropertyName(passage);
}

function chapterNumber(passage) {
  const chapters = passage[bookName(passage)];
  return firstPropertyName(chapters);
}

function firstVerseNumber(passage) {
  return firstPropertyName(verses(passage));
}

function lastVerseNumber(passage) {
  return lastPropertyName(verses(passage));
}

function verses(passage) {
  return passage[bookName(passage)][chapterNumber(passage)];
}

const concat = (first, second) => `${first} ${second}`

function text(passage) {
  return Object.values(verses(passage)).reduce(concat);
}

function textWithNumbers(passage) {
  return Object.entries(verses(passage))
    .map(([number, text]) => `(${number}) ${text}`)
    .reduce(concat);
}

function firstPropertyName(object) {
  return Object.keys(object)[0];
}

function lastPropertyName(object) {
  return Object.keys(object).slice(-1).pop();
}
