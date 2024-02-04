export const getIsMac = () => {
  if (typeof navigator === "undefined") return false;

  return Boolean(navigator.userAgent.match(/Mac/) && !navigator.maxTouchPoints);
};
