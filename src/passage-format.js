export default class Formatter {
  constructor() {
    this.templates = {}
  }

  addTemplate({name: name, template: template}) {
    this.templates[name] = template
  }

  removeTemplate(name) {
    delete this.templates[name]
  }

  setCurrentTemplate(name) {
    this.currentTemplate = this.templates[name]
    this.contentFormatter = contentFormatterFor(this.currentTemplate)
  }

  format(passages) {
    return format(this.currentTemplate, this.contentFormatter, passages)
  }
}

function format(template, formatVersesFn, passages) {
  return passages
    .map(singleBookPassage => formatSingleBook(template, formatVersesFn, singleBookPassage))
    .join('\n\n')
}

function formatSingleBook(template, formatVersesFn, passage) {
  const book = Object.keys(passage)[0]
  const chapters = Object.entries(passage[book])

  let chapter, chapterStart;
  chapter = chapterStart = chapters[0][0]
  const chapterEnd = last(chapters)[0]

  let verse, verseStart
  verse = verseStart = firstVerseNumber(chapters)
  const verseEnd = lastVerseNumber(chapters)

  let text, textWithNumbers, textWithLineBreaks, textWithNumbersAndLineBreaks
  text = textWithNumbers = textWithLineBreaks = textWithNumbersAndLineBreaks = formatVersesFn(versesFrom(chapters))

  return eval('`' + template + '`')
}

function firstVerseNumber(chapters) {
  return Object.keys(chapters[0][1])[0];
}

function lastVerseNumber(chapters) {
  return last(Object.keys(last(chapters)[1]))
}

function versesFrom(chapters) {
  return chapters
    .map(chapters.length > 1 ? extractVersesWithChapterNumber : extractVerses)
    .reduce(concat)
}

function extractVersesWithChapterNumber([chapter, verses]) {
  return Object.entries(verses).map(([verse, text]) => [`${chapter}:${verse}`, text])
}

function extractVerses([chapter, verses]) {
  return Object.entries(verses)
}

function contentFormatterFor(template) {
  const [_, fn] = Object.entries({
    textWithNumbersAndLineBreaks: verses => '\n' + verses.map(([k, v]) => `(${k}) ${v}`).join('\n'),
    textWithNumbers: verses => verses.map(([k, v]) => `(${k}) ${v}`).join(' '),
    textWithLineBreaks: verses => '\n' + verses.map(([k, v]) => v).join('\n'),
    text: verses => verses.map(([k, v]) => v).join(' ')
  }).find(([k, v]) => template.includes(k))
  return fn;
}

function concat(x, y) {
  return x.concat(y)
}

function last(arr) {
  return arr[arr.length - 1]
}
