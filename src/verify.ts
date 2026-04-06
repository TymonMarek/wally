import { VerifyConditionsContext } from "semantic-release";
import SemanticReleaseError from "@semantic-release/error";
import { PluginConfig } from "./config";
import { parsePluginArgs } from "./args";
import { ErrorCode, getError } from "./error";
import { runCommand } from "./command";

export async function verifyWally(
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
): Promise<SemanticReleaseError[]> {
  const errors: SemanticReleaseError[] = [];
  const { wallyToken } = parsePluginArgs(pluginConfig, context);

  if (!wallyToken) {
    errors.push(getError(ErrorCode.WallyTokenMissing));
  }

  if ((await runCommand("wally", ["--version"], context)).exitCode !== 0) {
    errors.push(getError(ErrorCode.WallyNotInstalled));
  }

  return errors;
}
