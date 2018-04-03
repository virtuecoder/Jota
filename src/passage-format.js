import contentFormatters from './content-formatters';

export default function format(template, passage) {
  const bookName = Object.keys(passage)[0];
  const bookContent = passage[bookName];

  const chapterNumbers = Object.keys(bookContent);
  const chapterStart = chapterNumbers[0];
  const chapterEnd = last(chapterNumbers);

  const verseStart = Object.keys(bookContent[chapterStart])[0];
  const verseEnd = last(Object.keys(bookContent[chapterEnd]));

  const verses = versesFrom(bookContent);

  const formatters = contentFormatters(template);

  return formatWith({
    template: template,
    book: bookName,
    chapter: chapterStart,
    chapterStart: chapterStart,
    chapterEnd: chapterEnd,
    verseStart: verseStart,
    verseEnd: verseEnd,
    verse: verseStart,
    text: formatters.text(verses),
    textWithNumbers: formatters.textWithNumbers(verses),
    textWithLineBreaks: formatters.textWithLineBreaks(verses),
    textWithNumbersAndLineBreaks: formatters.textWithNumbersAndLineBreaks(verses)
  })
}

function versesFrom(bookContent) {
  return Object.entries(bookContent)
    .map(hasMoreThanOneChapter(bookContent) ? extractVersesWithChapterNumber : extractVerses)
    .reduce(concat);
}

function extractVersesWithChapterNumber([chapter, verses]) {
  return Object.entries(verses).map(([verse, text]) => [`${chapter}:${verse}`, text]);
}

function extractVerses([chapter, verses]) {
  return Object.entries(verses);
}

function concat(x, y) {
  return x.concat(y);
}

function last(arr) {
  return arr[arr.length - 1];
}

function hasMoreThanOneChapter(bookContent) {
  return Object.keys(bookContent).length > 1;
}

function formatWith({
  template: template,
  book: book,
  chapter: chapter,
  chapterStart: chapterStart,
  chapterEnd: chapterEnd,
  verse: verse,
  verseStart: verseStart,
  verseEnd: verseEnd,
  text: text,
  textWithNumbers: textWithNumbers,
  textWithLineBreaks: textWithLineBreaks,
  textWithNumbersAndLineBreaks: textWithNumbersAndLineBreaks
}) {
  return eval('`' + template + '`');
}
