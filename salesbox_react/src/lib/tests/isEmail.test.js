import isEmail from 'lib/isEmail';

describe('lib/isEmail', () => {
  it('works properly with top level domains with more than 2 chars', () => {
    expect(isEmail('oz@gur.space')).toBe(true);
  });
  it('works with accents characters', () => {
    expect(isEmail("oz'@gur.space")).toBe(true);
  });
  it('needs an @', () => {
    expect(isEmail('oz.space')).toBe(false);
  });
});
