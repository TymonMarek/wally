import SemanticReleaseError from "@semantic-release/error";

import { homepage } from "../package.json";

export const link = (file: string) => `${homepage}/blob/main/${file}`;

export type ErrorDefinition = {
  message: string;
  details: string;
};

export const enum ErrorCode {
  WallyNotInstalled,
  WallyTokenMissing,
  WallyPackageNameMissing,
  WallyPackageMissing,
}

export const ERROR_DEFINITIONS: Record<ErrorCode, ErrorDefinition> = {
  [ErrorCode.WallyNotInstalled]: {
    message: "Wally is not installed.",
    details: `Wally must be installed to use this plugin.\n\nPlease install Wally by following the instructions at ${link("README.md#installation")}.`,
  },
  [ErrorCode.WallyTokenMissing]: {
    message: "Wally token is missing.",
    details: `A Wally token is required to use this plugin.\n\nPlease provide a valid Wally token by following the instructions at ${link("README.md#configuration")}.`,
  },
  [ErrorCode.WallyPackageNameMissing]: {
    message: "Wally package name is missing.",
    details: `The package name is required in the wally.toml file.\n\nPlease provide a valid package name by following the instructions at ${link("README.md#configuration")}.`,
  },
  [ErrorCode.WallyPackageMissing]: {
    message: "Wally package file is missing.",
    details: `The wally.toml file is required to use this plugin.\n\nPlease create a wally.toml file by following the instructions at ${link("README.md#configuration")}.`,
  },
};

export function getError(errorCode: ErrorCode): SemanticReleaseError {
  const definition = ERROR_DEFINITIONS[errorCode];
  return new SemanticReleaseError(
    definition.message,
    errorCode.toString(),
    definition.details,
  );
}
