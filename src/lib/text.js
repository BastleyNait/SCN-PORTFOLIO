/** "SEE THE DECISIONS" -> "See the decisions". The UI strings were written in
 *  capitals for the previous design; this one sets labels in sentence case. */
export function toSentence(value) {
  if (!value) return value;
  const lower = value.toLocaleLowerCase();
  return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}
