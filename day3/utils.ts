const a_code = "a".charCodeAt(0);
const A_code = "A".charCodeAt(0);
const z_code = "z".charCodeAt(0);
const Z_code = "Z".charCodeAt(0);

const a_priority = 1;
const A_priority = 27;

export function getItemPriority(c: string): number {
  const code = c.charCodeAt(0);

  if (code >= a_code && code <= z_code) {
    return code - (a_code - a_priority);
  } else if (code >= A_code && code <= Z_code) {
    return code - (A_code - A_priority);
  } else {
    return 0;
  }
}
