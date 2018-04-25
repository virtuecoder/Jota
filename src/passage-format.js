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
  const bookName = Object.keys(passage)[0]
  const bookContent = passage[bookName]

  const chapterNumbers = Object.keys(bookContent)
  const chapterStart = chapterNumbers[0]
  const chapterEnd = last(chapterNumbers)

  const verseStart = Object.keys(bookContent[chapterStart])[0]
  const verseEnd = last(Object.keys(bookContent[chapterEnd]))

  const verses = versesFrom(bookContent)

  const formatters = contentFormatters(template)

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

function hasMoreThanOneChapter(bookContent) {
  return Object.keys(bookContent).length > 1
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
