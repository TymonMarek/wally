import { PrepareContext } from "semantic-release";
import { PluginConfig } from "./config";
import { getWallyPackage, setWallyPackage } from "./package";

export async function prepareWally(
  pluginConfig: PluginConfig,
  context: PrepareContext,
): Promise<void> {
  const wallyPackage = await getWallyPackage(pluginConfig, context);
  wallyPackage.package.version = context.nextRelease.version;
  await setWallyPackage(wallyPackage, pluginConfig, context);
}
