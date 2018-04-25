import Formatter from '@/passage-format'

let formatter

beforeEach(() => {
  formatter = new Formatter()
})

test('Should add new template', () => {
  formatter.addTemplate({
    name: 'some name',
    template: 'some template'
  })

  expect(formatter.templates['some name']).toBe('some template')
})

test('Should remove template', () => {
  formatter.addTemplate({
    name: 'some name',
    template: 'some template'
  })

  formatter.removeTemplate('some name')

  expect(formatter.templates['some name']).toBeUndefined()
})

test('Should format single verse', () => {
  verifyFormat({
    passage: {'Gen' : {'1' : {'3' : 'And God said, Let there be light: and there was light.'}}},
    template: '${book} ${chapter}:${verse} "${text}"',

    expected: 'Gen 1:3 "And God said, Let there be light: and there was light."'
  })
})

test('Should format multiple verses', () => {
  verifyFormat({
    passage: {
      'Gen': {
        '1': {
          '3': 'And God said, Let there be light: and there was light.',
          '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
        }
      }
    },
    template: '${book} ${chapter}:${verseStart}-${verseEnd} "${text}"',

    expected: 'Gen 1:3-4 "And God said, Let there be light: and there was light. And God saw the light, that it was good: and God divided the light from the darkness."'
  })
})

test('Should format multiple verses with numbers', () => {
  verifyFormat({
    passage: {
      'Gen': {
        '1': {
          '3': 'And God said, Let there be light: and there was light.',
          '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
        }
      }
    },
    template: '${book} ${chapter}:${verseStart}-${verseEnd} "${textWithNumbers}"',

    expected: 'Gen 1:3-4 "(3) And God said, Let there be light: and there was light. (4) And God saw the light, that it was good: and God divided the light from the darkness."'
  })
})

test('Should format multiple verses with line breaks', () => {
  verifyFormat({
    passage: {
      'Gen': {
        '1': {
          '3': 'And God said, Let there be light: and there was light.',
          '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
        }
      }
    },
    template: '${book} ${chapter}:${verseStart}-${verseEnd} ${textWithLineBreaks}',
    expected: 'Gen 1:3-4 \nAnd God said, Let there be light: and there was light.\nAnd God saw the light, that it was good: and God divided the light from the darkness.'
  })
})

test('Should format multiple verses with numbers and line breaks', () => {
  verifyFormat({
    passage: {
      'Gen': {
        '1': {
          '3': 'And God said, Let there be light: and there was light.',
          '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
        }
      }
    },
    template: '${book} ${chapter}:${verseStart}-${verseEnd} ${textWithNumbersAndLineBreaks}',
    expected: 'Gen 1:3-4 \n(3) And God said, Let there be light: and there was light.\n(4) And God saw the light, that it was good: and God divided the light from the darkness.'
  })
})

test('Should format multiple chapters', () => {
  verifyFormat({
    passage: {
      'Gen': {
        '1': {
          '31': 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.'
        },
        '2': {
          '1': 'Thus the heavens and the earth were finished, and all the host of them.'
        }
      }
    },
    template: '${book} ${chapterStart}:${verseStart}-${chapterEnd}:${verseEnd} "${text}"',
    expected: 'Gen 1:31-2:1 "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day. Thus the heavens and the earth were finished, and all the host of them."'
  })
})

test('Should format multiple chapters with numbers', () => {
  verifyFormat({
    passage: {
      'Gen': {
        '1': {
          '31': 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.'
        },
        '2': {
          '1': 'Thus the heavens and the earth were finished, and all the host of them.'
        }
      }
    },
    template: '${book} ${chapterStart}:${verseStart}-${chapterEnd}:${verseEnd} "${textWithNumbers}"',
    expected: 'Gen 1:31-2:1 "(1:31) And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day. (2:1) Thus the heavens and the earth were finished, and all the host of them."'
  })
})

test('Should format multi-book passage', () => {
  verifyFormat({
    passage: {
      'Gen' : {'1' : {'3' : 'And God said, Let there be light: and there was light.'}},
      'Ecc' : {'1' : {'2' : 'Vanity of vanities, saith the Preacher, vanity of vanities; all is vanity.'}}
    },
    template: '${book} ${chapter}:${verse} "${text}"',

    expected: 'Gen 1:3 "And God said, Let there be light: and there was light."\n\nEcc 1:2 "Vanity of vanities, saith the Preacher, vanity of vanities; all is vanity."'
  })
})

function verifyFormat({passage, template, expected}) {
  formatter.addTemplate({
    name: 'some name',
    template: template
  })
  expect(formatter.format('some name', passage)).toBe(expected)
}
