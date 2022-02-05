export async function sha256(str: string) {
  const strArray = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", strArray);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hash;
}
