import { helpers } from "../src";

describe("From-to animation properties", () => {
  it("Should serialise the animation properties", () => {
    const fromTo = helpers.start({ from: 400, to: 500 });

    expect(Array.isArray(fromTo)).toBe(true);
    expect(fromTo.length).toBe(2);

    const times = helpers.times(3);

    expect(typeof times).toBe("string");
    expect(times).toBe("*=3");

    const startAfter = helpers.startAfter(2000);

    expect(typeof startAfter).toBe("string");
    expect(startAfter).toBe("+=2000");

    const startBefore = helpers.startBefore(2000);

    expect(typeof startBefore).toBe("string");
    expect(startBefore).toBe("-=2000");
  });
});
