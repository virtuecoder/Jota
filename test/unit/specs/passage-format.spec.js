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
  const template = '${book} ${chapter}:${verse start}-${verse end} "${text}"';

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
  const template = '${book} ${chapter}:${verse start}-${verse end} "${text with numbers}"';

  const result = format(template, passage);

  expect(result).toBe('Foo 1:2-4 "(2) Bar, bar. (3) Baz baz. (4) Quix, quix."');
});
