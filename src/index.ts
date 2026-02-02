import {
  // AnalyzeCommitsContext,
  // GenerateNotesContext,
  // PublishContext,
  // PrepareContext,
  VerifyConditionsContext,
  // VerifyReleaseContext,
  // SuccessContext,
  // FailContext,
} from "semantic-release";
import { PluginConfig } from "./config";
import { verifyWally } from "./verify";
import { getWallyPackage } from "./package";

// let verified: boolean = false;

export async function verifyConditions(
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
) {
  const errors = await verifyWally(pluginConfig, context);

  try {
    await getWallyPackage(pluginConfig, context);
  } catch (error: unknown) {
    if (error instanceof Error) {
      errors.push(...errors);
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  // verified = true;
}

// export async function analyzeCommits(
//   pluginConfig: PluginConfig,
//   context: AnalyzeCommitsContext,
// ) {}

// export async function verifyRelease(
//   pluginConfig: PluginConfig,
//   context: VerifyReleaseContext,
// ) {}

// export async function generateNotes(
//   pluginConfig: PluginConfig,
//   context: GenerateNotesContext,
// ) {}

// export async function addChannel(
//   pluginConfig: PluginConfig,
//   context: VerifyReleaseContext,
// ) {}

// export async function prepare(
//   pluginConfig: PluginConfig,
//   context: PrepareContext,
// ) {}

// export async function publish(
//   pluginConfig: PluginConfig,
//   context: PublishContext,
// ) {}

// export async function success(
//   pluginConfig: PluginConfig,
//   context: SuccessContext,
// ) {}

// export async function fail(
//   pluginConfig: PluginConfig,
//   context: FailContext,
// ) {}
