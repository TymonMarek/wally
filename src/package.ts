import toml from "toml";
import path from "path";
import fs from "fs/promises";
import { ErrorCode, getError } from "./error";
import AggregateError from "aggregate-error";
import { VerifyConditionsContext } from "semantic-release";
import { PluginConfig } from "./config";

export type WallyPackage = {
  package: {
    name: string;
    description: string;
    version: string;
    license: string;
    authors: string[];
    realm: string;
    registry: string;
    homepage: string;
    repository: string;
    exclude: string[];
    private: boolean;
  };
  dependencies: Record<string, string>;
  serverDependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

export async function readWallyPackage(
  _: PluginConfig,
  context: VerifyConditionsContext,
): Promise<WallyPackage> {
  const wallyPackagePath = path.join(
    context.cwd ?? process.cwd(),
    "wally.toml",
  );
  const wallyPackageContent = await fs.readFile(wallyPackagePath, "utf-8");
  const wallyPackage = toml.parse(wallyPackageContent) as WallyPackage;
  return wallyPackage;
}

export async function getWallyPackage(
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
): Promise<WallyPackage> {
  try {
    const wallyPackage = await readWallyPackage(pluginConfig, context);
    if (!wallyPackage.package.name) {
      throw getError(ErrorCode.WallyPackageNameMissing);
    }

    return wallyPackage;
  } catch (error: unknown) {
    // If the error is due to file not found, throw a custom error.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new AggregateError([getError(ErrorCode.WallyPackageMissing)]);
    }
    if (error instanceof Error) {
      throw new AggregateError([error]);
    }
    throw error;
  }
}
