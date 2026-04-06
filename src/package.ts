import toml from "@iarna/toml";
import path from "path";
import fs from "fs/promises";
import { ErrorCode, getError, withFileErrorHandling } from "./error";
import { VerifyConditionsContext } from "semantic-release";
import { PluginConfig } from "./config";

export type Realm = "server" | "shared";

function isValidRealm(value: unknown): value is Realm {
  return value === "server" || value === "shared";
}

function isValidVersion(version: unknown): version is string {
  if (typeof version !== "string") return false;
  return /^\d+\.\d+\.\d+/.test(version);
}

function isValidUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export type WallyPackage = {
  package: {
    name: string;
    description: string;
    version: string;
    license?: string;
    authors?: string[];
    realm: Realm;
    registry: string;
    homepage?: string;
    repository?: string;
    exclude?: string[];
    private?: boolean;
  };
  dependencies?: Record<string, string>;
  serverDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

function validateWallyPackage(pkg: unknown): asserts pkg is WallyPackage {
  if (!pkg || typeof pkg !== "object") {
    throw getError(
      ErrorCode.WallyConfigurationInvalid,
      "The parsed wally.toml content is not a TOML table/object.",
    );
  }

  const wallyPkg = pkg as Record<string, unknown>;
  if (!wallyPkg.package || typeof wallyPkg.package !== "object") {
    throw getError(
      ErrorCode.WallyConfigurationInvalid,
      "Missing or invalid [package] table in wally.toml.",
    );
  }

  const pkgInfo = wallyPkg.package as Record<string, unknown>;

  if (typeof pkgInfo.name !== "string" || !pkgInfo.name.trim()) {
    throw getError(
      ErrorCode.WallyConfigurationInvalid,
      'Field "package.name" is required and must be a non-empty string.',
    );
  }

  if (!isValidVersion(pkgInfo.version)) {
    throw getError(
      ErrorCode.WallyConfigurationInvalid,
      'Field "package.version" is required and must match x.x.x.',
    );
  }

  if (!isValidUrl(pkgInfo.registry)) {
    throw getError(
      ErrorCode.WallyConfigurationInvalid,
      'Field "package.registry" is required and must be a valid URL.',
    );
  }

  if (!isValidRealm(pkgInfo.realm)) {
    throw getError(
      ErrorCode.WallyConfigurationInvalid,
      'Field "package.realm" is required and must be "server" or "shared".',
    );
  }
}

export async function readWallyPackage(
  _pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
): Promise<WallyPackage> {
  const wallyPackagePath = path.join(
    context.cwd ?? process.cwd(),
    "wally.toml",
  );
  const wallyPackageContent = await fs.readFile(wallyPackagePath, "utf-8");
  const wallyPackage = toml.parse(wallyPackageContent);
  validateWallyPackage(wallyPackage);
  return wallyPackage;
}

export async function writeWallyPackage(
  wallyPackage: WallyPackage,
  _pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
): Promise<void> {
  validateWallyPackage(wallyPackage);

  const wallyPackagePath = path.join(
    context.cwd ?? process.cwd(),
    "wally.toml",
  );

  let content = await fs.readFile(wallyPackagePath, "utf-8");

  // Replace only the version field using regex to preserve formatting
  content = content.replace(
    /^version\s*=\s*"[^"]*"/m,
    `version = "${wallyPackage.package.version}"`,
  );

  await fs.writeFile(wallyPackagePath, content, "utf-8");
}

export async function getWallyPackage(
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
): Promise<WallyPackage> {
  return withFileErrorHandling(async () => {
    const wallyPackage = await readWallyPackage(pluginConfig, context);
    return wallyPackage;
  }, getError(ErrorCode.WallyPackageMissing));
}

export async function setWallyPackage(
  wallyPackage: WallyPackage,
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
): Promise<void> {
  return withFileErrorHandling(
    () => writeWallyPackage(wallyPackage, pluginConfig, context),
    getError(ErrorCode.WallyPackageMissing),
  );
}
