import { VerifyConditionsContext } from "semantic-release";
import { PluginConfig } from "./config";
import { ErrorCode, getError } from "./error";
import { runCommand } from "./command";

export async function loginWally(
  _pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
): Promise<boolean> {
  const githubToken = context.env.GITHUB_TOKEN;

  if (!githubToken) {
    throw getError(ErrorCode.WallyTokenMissing);
  }

  const result = await runCommand(
    "wally",
    ["login", "--token", githubToken],
    context,
  );

  if (result.exitCode !== 0) {
    throw getError(
      ErrorCode.WallyAuthenticationFailed,
      `wally login exited with status ${result.exitCode}.`,
    );
  }

  return true;
}
