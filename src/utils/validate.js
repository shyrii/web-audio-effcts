export const validate = (min, option, max) => {
  return Math.min(Math.max(min, option), max);
}