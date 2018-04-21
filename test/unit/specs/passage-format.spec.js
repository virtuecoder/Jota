import Formatter from '@/passage-format';

let formatter;

beforeEach(() => {
  formatter = new Formatter();
})

test('Should add new template', () => {
  formatter.addTemplate({
    name: 'some name',
    template: 'some template'
  })

  expect(formatter.templates['some name']).toBe('some template');
});

test('Should remove template', () => {
  formatter.addTemplate({
    name: 'some name',
    template: 'some template'
  })

  formatter.removeTemplate('some name');

  expect(formatter.templates['some name']).toBeUndefined();
});

test('Should format single verse', () => {
  const passage = {'Gen' : {'1' : {'3' : 'And God said, Let there be light: and there was light.'}}};
  formatter.addTemplate({
    name: 'single verse',
    template: '${book} ${chapter}:${verse} "${text}"'
  })

  const result = formatter.format('single verse', passage);

  expect(result).toBe('Gen 1:3 "And God said, Let there be light: and there was light."');
});

test('Should format multiple verses', () => {
  const passage = {
    'Gen': {
      '1': {
        '3': 'And God said, Let there be light: and there was light.',
        '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
      }
    }
  };
  formatter.addTemplate({
    name: 'multiple verses',
    template: '${book} ${chapter}:${verseStart}-${verseEnd} "${text}"'
  })

  const result = formatter.format('multiple verses', passage);

  expect(result).toBe('Gen 1:3-4 "And God said, Let there be light: and there was light. And God saw the light, that it was good: and God divided the light from the darkness."');
});

test('Should format multiple verses with numbers', () => {
  const passage = {
    'Gen': {
      '1': {
        '3': 'And God said, Let there be light: and there was light.',
        '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
      }
    }
  };
  formatter.addTemplate({
    name: 'verses with numbers',
    template: '${book} ${chapter}:${verseStart}-${verseEnd} "${textWithNumbers}"'
  })

  const result = formatter.format('verses with numbers', passage);

  expect(result).toBe('Gen 1:3-4 "(3) And God said, Let there be light: and there was light. (4) And God saw the light, that it was good: and God divided the light from the darkness."');
});

test('Should format multiple verses with line breaks', () => {
  const passage = {
    'Gen': {
      '1': {
        '3': 'And God said, Let there be light: and there was light.',
        '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
      }
    }
  };
  formatter.addTemplate({
    name: 'verses with line breaks',
    template: '${book} ${chapter}:${verseStart}-${verseEnd} ${textWithLineBreaks}'
  })

  const result = formatter.format('verses with line breaks', passage);

  expect(result).toBe('Gen 1:3-4 \nAnd God said, Let there be light: and there was light.\nAnd God saw the light, that it was good: and God divided the light from the darkness.');
});

test('Should format multiple verses with numbers and line breaks', () => {
  const passage = {
    'Gen': {
      '1': {
        '3': 'And God said, Let there be light: and there was light.',
        '4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
      }
    }
  };
  formatter.addTemplate({
    name: 'verses with numbers and line breaks',
    template: '${book} ${chapter}:${verseStart}-${verseEnd} ${textWithNumbersAndLineBreaks}'
  })

  const result = formatter.format('verses with numbers and line breaks', passage);

  expect(result).toBe('Gen 1:3-4 \n(3) And God said, Let there be light: and there was light.\n(4) And God saw the light, that it was good: and God divided the light from the darkness.');
});

test('Should format multiple chapters', () => {
  const passage = {
    'Gen': {
      '1': {
        '31': 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.'
      },
      '2': {
        '1': 'Thus the heavens and the earth were finished, and all the host of them.'
      }
    }
  };
  formatter.addTemplate({
    name: 'cross-chapters passage',
    template: '${book} ${chapterStart}:${verseStart}-${chapterEnd}:${verseEnd} "${text}"'
  })

  const result = formatter.format('cross-chapters passage', passage);

  expect(result).toBe('Gen 1:31-2:1 "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day. Thus the heavens and the earth were finished, and all the host of them."');
});

test('Should format multiple chapters with numbers', () => {
  const passage = {
    'Gen': {
      '1': {
        '31': 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.'
      },
      '2': {
        '1': 'Thus the heavens and the earth were finished, and all the host of them.'
      }
    }
  };
  formatter.addTemplate({
    name: 'cross-chapters passage with numbers',
    template: '${book} ${chapterStart}:${verseStart}-${chapterEnd}:${verseEnd} "${textWithNumbers}"'
  })

  const result = formatter.format('cross-chapters passage with numbers', passage);

  expect(result).toBe('Gen 1:31-2:1 "(1:31) And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day. (2:1) Thus the heavens and the earth were finished, and all the host of them."');
});
