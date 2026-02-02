import SemanticReleaseError from "@semantic-release/error";
import { ERROR_DEFINITIONS, ErrorCode, getError, link } from "../src/error";

test("error definition generates error link correctly", () => {
  expect(link("README.md#usage")).toBe(
    "https://github.com/TymonMarek/wally/blob/main/README.md#usage",
  );
});

test("error definition generates error link without fragment", () => {
  expect(link("src/index.ts")).toBe(
    "https://github.com/TymonMarek/wally/blob/main/src/index.ts",
  );
});

test("error definition generates error link with empty input", () => {
  expect(link("")).toBe("https://github.com/TymonMarek/wally/blob/main/");
});

test("getError generates SemanticReleaseError with correct properties", () => {
  const semanticError = getError(ErrorCode.WallyNotInstalled);

  expect(semanticError).toBeInstanceOf(SemanticReleaseError);
  expect(semanticError.message).toBe(
    ERROR_DEFINITIONS[ErrorCode.WallyNotInstalled].message,
  );
  expect(semanticError.code).toBe(ErrorCode.WallyNotInstalled.toString());
  expect(semanticError.details).toBe(
    ERROR_DEFINITIONS[ErrorCode.WallyNotInstalled].details,
  );
});
