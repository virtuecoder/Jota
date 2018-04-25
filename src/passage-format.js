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
    this.contentFormatters = contentFormatters(this.currentTemplate)
  }

  format(passage) {
    return format(this.currentTemplate, this.contentFormatters, passage)
  }
}

function format(template, formatters, passage) {
  return slice(passage)
    .map(singleBookPassage => formatSingleBook(template, formatters, singleBookPassage))
    .join('\n\n')
}

function formatSingleBook(template, formatters, passage) {
  const bookName = Object.keys(passage)[0]
  const chapters = Object.entries(passage[bookName])
  const verses = versesFrom(chapters)
  return formatWith({
    template: template,
    book: bookName,
    chapter: chapters[0][0],
    chapterStart: chapters[0][0],
    chapterEnd: last(chapters)[0],
    verse: firstVerseNumber(chapters),
    verseStart: firstVerseNumber(chapters),
    verseEnd: lastVerseNumber(chapters),
    text: formatters.text(verses),
    textWithNumbers: formatters.textWithNumbers(verses),
    textWithLineBreaks: formatters.textWithLineBreaks(verses),
    textWithNumbersAndLineBreaks: formatters.textWithNumbersAndLineBreaks(verses)
  })
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

function contentFormatters(template) {
  const attributeFormatterMap = {
    textWithNumbersAndLineBreaks: verses => '\n' + verses.map(([k, v]) => `(${k}) ${v}`).join('\n'),
    textWithNumbers: verses => verses.map(([k, v]) => `(${k}) ${v}`).join(' '),
    textWithLineBreaks: verses => '\n' + verses.map(([k, v]) => v).join('\n'),
    text: verses => verses.map(([k, v]) => v).join(' ')
  }
  const formatters = objectWithDefaultValue(() => undefined)
  const [attr, formatter] = Object.entries(attributeFormatterMap).find(([k, v]) => template.includes(k))
  formatters[attr] = formatter
  return formatters
}

function objectWithDefaultValue(defaultValue) {
  return new Proxy({}, {
    get: (target, name) => name in target ? target[name] : defaultValue
  })
}

function formatWith({
  template, book, chapter, chapterStart, chapterEnd, verse, verseStart,
  verseEnd, text, textWithNumbers, textWithLineBreaks, textWithNumbersAndLineBreaks,
}) {
  return eval('`' + template + '`')
}

function slice(obj) {
  return Object.entries(obj).map(([k, v]) => {
    const result = {}
    result[k] = v
    return result
  })
}

function concat(x, y) {
  return x.concat(y)
}

function last(arr) {
  return arr[arr.length - 1]
}
