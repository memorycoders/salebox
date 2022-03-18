//@flow
export default (pass: string) => {
  let score = 0;
  if (!pass) {
    return score;
  }

  const letters = {};
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  };

  const variationCount = Object.keys(variations)
    .map((check: string) => (variations[check] ? 1 : 0))
    .reduce((total, variaionScore) => total + variaionScore, 0);
  score += (variationCount - 1) * 10;

  return Math.min(parseInt(score, 10), 100);
};
