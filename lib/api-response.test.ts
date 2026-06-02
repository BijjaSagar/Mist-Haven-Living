import { describe, expect, it } from "vitest";
import { getApiData, getApiErrorMessage } from "./api-response";

describe("getApiErrorMessage", () => {
  it("reads message from envelope error", () => {
    expect(
      getApiErrorMessage({ success: false, error: { message: "Not found" } }),
    ).toBe("Not found");
  });

  it("reads legacy string error", () => {
    expect(getApiErrorMessage({ error: "Invalid credentials" })).toBe(
      "Invalid credentials",
    );
  });

  it("returns default for invalid body", () => {
    expect(getApiErrorMessage(null)).toBe("Request failed");
  });
});

describe("getApiData", () => {
  it("unwraps success envelope", () => {
    const payload = { id: 1, name: "Towels" };
    expect(getApiData({ success: true, data: payload })).toEqual(payload);
  });

  it("passes through legacy body unchanged", () => {
    const legacy = [{ slug: "bath" }];
    expect(getApiData(legacy)).toEqual(legacy);
  });
});
