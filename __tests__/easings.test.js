import { helpers } from "../src";

const { getEasings, createCurve } = helpers;

describe("Easings", () => {
  it("Should return array of easings name available", () => {
    const easings = getEasings();

    expect(Array.isArray(easings)).toBe(true);
    // Considering we haven't created a new easing curve
    expect(easings.length).toBe(28);
  });
});
