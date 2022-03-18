export const getCurrentTimeZone = () => {
  var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
  return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ("00" + (o % 60)).slice(-2);
};

export const getCurrentTimeZoneEndCodeURI = () => {
  return encodeURIComponent(this.getCurrentTimeZone());
};
export default getCurrentTimeZone();
