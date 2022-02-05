import { assert, it } from "vitest";
import { sha256base64 } from "./sha256";

it("sha256base64", async () => {
  assert.equal(
    await sha256base64("ks02i3jdikdo2k0dkfodf3m39rjfjsdk0wk349rj3jrhf"),
    "2i0WFA-0AerkjQm4X4oDEhqA17QIAKNjXpagHBXmO_U"
  );
});
