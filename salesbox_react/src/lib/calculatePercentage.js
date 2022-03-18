const calculatePercentage = (value, max) => {
  if (!value) {
    return 0;
  }
  return Math.round(Math.max(0.005, Math.min(1, value / max)) * 100);
};

export default calculatePercentage;
