import { PrepareContext } from "semantic-release";
import { PluginConfig } from "./config";
import { runCommand } from "./command";

export async function publishWally(
  _pluginConfig: PluginConfig,
  context: PrepareContext,
): Promise<void> {
  const result = await runCommand("wally", ["publish"], context);

  if (result.exitCode !== 0) {
    throw new Error("Failed to publish package with Wally.");
  }
}
