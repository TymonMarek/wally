import SemanticReleaseError from "@semantic-release/error";

import { homepage } from "../package.json";

export const link = (file: string) => `${homepage}/blob/main/${file}`;

export type ErrorDefinition = {
  message: string;
  details: string;
};

export const enum ErrorCode {
  WallyNotInstalled,
}

export const ERROR_DEFINITIONS: Record<ErrorCode, ErrorDefinition> = {
  [ErrorCode.WallyNotInstalled]: {
    message: "Wally is not installed.",
    details: `Wally must be installed to use this plugin. Please install Wally by following the instructions at ${link("README.md#installation")}.`,
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
