import format from '@/passage-format';

test('Should format single verse', () => {
  const passage = {'Foo' : {'1' : {'2' : 'Bar, baz'}}};
  const template = '${book} ${chapter}:${verse} "${text}"';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:2 "Bar, baz"');
});

test('Should format multiple verses', () => {
  const passage = {'Foo' :
    {'1' :
      {'2' : 'Bar, bar.',
       '3' : 'Baz baz.',
       '4' : 'Quix, quix.'}
    }
  };
  const template = '${book} ${chapter}:${verseStart}-${verseEnd} "${text}"';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:2-4 "Bar, bar. Baz baz. Quix, quix."');
});

test('Should format multiple verses with numbers', () => {
  const passage = {'Foo' :
    {'1' :
      {'2' : 'Bar, bar.',
       '3' : 'Baz baz.',
       '4' : 'Quix, quix.'}
    }
  };
  const template = '${book} ${chapter}:${verseStart}-${verseEnd} "${textWithNumbers}"';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:2-4 "(2) Bar, bar. (3) Baz baz. (4) Quix, quix."');
});

test('Should format multiple verses with line breaks', () => {
  const passage = {'Foo' :
    {'1' :
      {'2' : 'Bar, bar.',
       '3' : 'Baz baz.',
       '4' : 'Quix, quix.'}
    }
  };
  const template = '${book} ${chapter}:${verseStart}-${verseEnd} ${textWithLineBreaks}';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:2-4 \nBar, bar.\nBaz baz.\nQuix, quix.');
});

test('Should format multiple verses with numbers and line breaks', () => {
  const passage = {'Foo' :
    {'1' :
      {'2' : 'Bar, bar.',
       '3' : 'Baz baz.',
       '4' : 'Quix, quix.'}
    }
  };
  const template = '${book} ${chapter}:${verseStart}-${verseEnd} ${textWithNumbersAndLineBreaks}';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:2-4 \n(2) Bar, bar.\n(3) Baz baz.\n(4) Quix, quix.');
});

test('Should format multiple chapters', () => {
  const passage = {
    'Foo' : {
      '1' : {'1' : 'Bar, bar.'},
      '2' : {'1' : 'Baz, baz.' }
    }
  };
  const template = '${book} ${chapterStart}:${verseStart}-${chapterEnd}:${verseEnd} "${text}"';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:1-2:1 "Bar, bar. Baz, baz."');
});

test('Should format multiple chapters with numbers', () => {
  const passage = {
    'Foo' : {
      '1' : {'1' : 'Bar, bar.'},
      '2' : {'1' : 'Baz, baz.' }
    }
  };
  const template = '${book} ${chapterStart}:${verseStart}-${chapterEnd}:${verseEnd} "${textWithNumbers}"';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:1-2:1 "(1:1) Bar, bar. (2:1) Baz, baz."');
});
