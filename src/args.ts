import { VerifyConditionsContext } from "semantic-release";
import { PluginConfig } from "./config";

export type PluginArgs = {
  wallyToken?: string;
};

export function parsePluginArgs(
  _: PluginConfig,
  context: VerifyConditionsContext,
): PluginArgs {
  const wallyToken = context.env.WALLY_TOKEN;
  return { wallyToken };
}
