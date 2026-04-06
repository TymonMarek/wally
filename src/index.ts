import {
  PublishContext,
  PrepareContext,
  VerifyConditionsContext,
} from "semantic-release";
import { PluginConfig } from "./config";
import { collectErrors, throwIfErrors } from "./error";
import { verifyWally } from "./verify";
import { getWallyPackage } from "./package";
import { prepareWally } from "./prepare";
import { publishWally } from "./publish";
import { loginWally } from "./login";

let verified: boolean = false;
let prepared: boolean = false;
let authenticated: boolean = false;

export async function verifyConditions(
  pluginConfig: PluginConfig,
  context: VerifyConditionsContext,
) {
  const errors: Error[] = [];

  await collectErrors(() => verifyWally(pluginConfig, context), errors);
  await collectErrors(() => getWallyPackage(pluginConfig, context), errors);

  if (!authenticated) {
    const didAuthenticate = await collectErrors(
      () => loginWally(pluginConfig, context),
      errors,
    );
    authenticated = didAuthenticate === true;
  }

  throwIfErrors(errors);
  verified = true;
}

export async function prepare(
  pluginConfig: PluginConfig,
  context: PrepareContext,
) {
  const errors: Error[] = [];

  if (!verified) {
    await collectErrors(() => verifyWally(pluginConfig, context), errors);
  }

  await collectErrors(() => getWallyPackage(pluginConfig, context), errors);
  await collectErrors(() => prepareWally(pluginConfig, context), errors);

  throwIfErrors(errors);
  prepared = true;
}

export async function publish(
  pluginConfig: PluginConfig,
  context: PublishContext,
) {
  const errors: Error[] = [];

  if (!verified) {
    await collectErrors(() => verifyWally(pluginConfig, context), errors);
  }

  await collectErrors(() => getWallyPackage(pluginConfig, context), errors);

  throwIfErrors(errors);

  if (!prepared) {
    await collectErrors(() => prepareWally(pluginConfig, context), errors);
    throwIfErrors(errors);
    prepared = true;
  }

  await collectErrors(() => publishWally(pluginConfig, context), errors);

  throwIfErrors(errors);
}
