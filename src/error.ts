import SemanticReleaseError from "@semantic-release/error";
import AggregateError from "aggregate-error";

export const link = (file: string) =>
  `https://github.com/TymonMarek/wally/blob/main/${file}`;

export type ErrorDefinition = {
  message: string;
  details: string;
};

export const enum ErrorCode {
  WallyNotInstalled,
  WallyTokenMissing,
  WallyPackageNameMissing,
  WallyPackageMissing,
  WallyConfigurationInvalid,
  WallyAuthenticationFailed,
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
  [ErrorCode.WallyConfigurationInvalid]: {
    message: "Wally configuration is invalid.",
    details: `Your wally.toml configuration is invalid.\n\nRequired fields: package.name (string), package.version (x.x.x), package.registry (valid URL), and package.realm (server|shared).\n\nPlease fix your configuration by following the instructions at ${link("README.md#configuration")}.`,
  },
  [ErrorCode.WallyAuthenticationFailed]: {
    message: "Wally authentication failed.",
    details: `The plugin could not authenticate with Wally using GITHUB_TOKEN.\n\nMake sure GITHUB_TOKEN is present, valid, and has sufficient permissions.`,
  },
};

export function getError(
  errorCode: ErrorCode,
  extraDetails?: string,
): SemanticReleaseError {
  const definition = ERROR_DEFINITIONS[errorCode];
  const details = extraDetails
    ? `${definition.details}\n\n${extraDetails}`
    : definition.details;

  return new SemanticReleaseError(
    definition.message,
    errorCode.toString(),
    details,
  );
}

export async function collectErrors<T>(
  operation: () => Promise<T>,
  errors: Error[],
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error: unknown) {
    if (error instanceof AggregateError) {
      errors.push(...error.errors);
    } else if (error instanceof Error) {
      errors.push(error);
    }
  }
}

export function throwIfErrors(errors: Error[]): void {
  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
}

export async function withFileErrorHandling<T>(
  operation: () => Promise<T>,
  notFoundError: Error,
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new AggregateError([notFoundError]);
    }
    if (error instanceof Error) {
      throw new AggregateError([error]);
    }
    throw error;
  }
}
