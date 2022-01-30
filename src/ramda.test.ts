import { equals, mergeDeepRight } from "ramda";
import { assert, describe, it } from "vitest";

describe("ramda", () => {
  it("mergeDeepRight", () => {
    assert.deepEqual(mergeDeepRight({}, {}), {});
    assert.deepEqual(
      mergeDeepRight({ a: { b: "left" } }, { a: { b: "right" } }),
      { a: { b: "right" } }
    );
  });
  it("equals", () => {
    assert(equals(["1", "2", "3"], ["1", "2", "3"]));
  });
});
