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

  format(templateName, passage) {
    return format(this.templates[templateName], passage)
  }
}

function format(template, passage) {
  return slice(passage)
    .map(singleBookPassage => formatSingleBook(template, singleBookPassage))
    .join('\n\n')
}

function slice(obj) {
  return Object.entries(obj).map(([k, v]) => {
    const result = {}
    result[k] = v
    return result
  })
}

function formatSingleBook(template, passage) {
  const bookName = Object.keys(passage)[0]
  const chapters = Object.entries(passage[bookName])
  const verses = versesFrom(chapters)
  const formatters = contentFormatters(template)
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

function concat(x, y) {
  return x.concat(y)
}

function last(arr) {
  return arr[arr.length - 1]
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
