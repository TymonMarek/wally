import AggregateError from "aggregate-error";
import {
  ErrorCode,
  collectErrors,
  getError,
  throwIfErrors,
  withFileErrorHandling,
} from "../src/error";

test("getError appends extra details", () => {
  const error = getError(ErrorCode.WallyAuthenticationFailed, "status code: 9");

  expect(error.code).toBe(ErrorCode.WallyAuthenticationFailed.toString());
  expect(error.details).toContain("status code: 9");
});

test("collectErrors returns operation result when no error", async () => {
  const errors: Error[] = [];

  const result = await collectErrors(async () => 123, errors);

  expect(result).toBe(123);
  expect(errors).toEqual([]);
});

test("collectErrors flattens aggregate errors", async () => {
  const first = new Error("a");
  const second = new Error("b");
  const errors: Error[] = [];

  await collectErrors(async () => {
    throw new AggregateError([first, second]);
  }, errors);

  expect(errors).toEqual([first, second]);
});

test("throwIfErrors throws aggregate error when errors exist", () => {
  expect(() => throwIfErrors([new Error("x")])).toThrow(AggregateError);
});

test("withFileErrorHandling maps ENOENT to provided notFoundError", async () => {
  const notFoundError = new Error("missing");

  await expect(
    withFileErrorHandling(async () => {
      throw Object.assign(new Error("enoent"), { code: "ENOENT" });
    }, notFoundError),
  ).rejects.toMatchObject({
    errors: [notFoundError],
  });
});

test("withFileErrorHandling rethrows non-Error unknown values", async () => {
  await expect(
    withFileErrorHandling(async () => {
      throw "plain-string-error";
    }, new Error("unused")),
  ).rejects.toBe("plain-string-error");
});

test("withFileErrorHandling wraps generic Error values in AggregateError", async () => {
  const original = new Error("boom");

  await expect(
    withFileErrorHandling(async () => {
      throw original;
    }, new Error("unused")),
  ).rejects.toMatchObject({
    errors: [original],
  });
});
