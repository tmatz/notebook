export async function sha256base64(str: string): Promise<string> {
  if (typeof window !== "undefined") {
    // for Browser
    const buffer = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(str)
    );
    return btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)))
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } else {
    // for Node.js
    const crypto = await import("crypto");
    var hash256 = crypto.createHash("sha256");
    hash256.update(str);
    return Promise.resolve(hash256.digest("base64url"));
  }
}
