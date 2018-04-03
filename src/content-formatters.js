const attributeFormatterMap = {
  textWithNumbersAndLineBreaks: verses => '\n' + verses.map(([k, v]) => `(${k}) ${v}`).join('\n'),
  textWithNumbers: verses => verses.map(([k, v]) => `(${k}) ${v}`).join(' '),
  textWithLineBreaks: verses => '\n' + verses.map(([k, v]) => v).join('\n'),
  text: verses => verses.map(([k, v]) => v).join(' ')
}

export default function contentFormatters(template) {
  const formatters = objectWithDefaultValue(() => undefined);
  const [attr, formatter] = Object.entries(attributeFormatterMap).find(([k, v]) => template.includes(k));
  formatters[attr] = formatter;
  return formatters;
}

function objectWithDefaultValue(defaultValue) {
  return new Proxy({}, {
    get: (target, name) => name in target ? target[name] : defaultValue
  });
}
